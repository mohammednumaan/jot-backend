import bcrypt from "bcrypt";
import {
  AccessTokenPayloadType,
  IAuthLoginDTO,
  IAuthUserDTO,
} from "./auth.types";
import jwt from "jsonwebtoken";
import { AuthSignupRequestType } from "../../zod/auth/signup.z";
import { AuthLoginRequestType } from "../../zod/auth/login.z";
import { BadRequestError, NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import { envData } from "../../env";
import { IUser } from "../user/user.types";
import { AuthMapper } from "./auth.mapper";
import { Databases } from "../../db/index.db";

export class AuthService {
  private readonly databases: Databases;
  private readonly mapper: AuthMapper;
  constructor() {
    this.mapper = new AuthMapper();
    this.databases = new Databases();
  }
  async signup(signupData: AuthSignupRequestType): Promise<IAuthUserDTO> {
    const existingUser = await this.databases.user.findOneByUsername(
      signupData.username
    );
    if (existingUser) {
      throw new BadRequestError("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(
      signupData.password,
      envData.SALT_ROUNDS
    );

    const user = await prismaErrorHandler<IUser>(() =>
      this.databases.user.create({
        username: signupData.username,
        password: hashedPassword,
        avatar: ""
      })
    );

    const mapperUser: IAuthUserDTO = this.mapper.mapToSignupUser(user);
    return mapperUser;
  }

  async login(loginData: AuthLoginRequestType): Promise<IAuthLoginDTO> {
    const user = await prismaErrorHandler<IUser | null>(() =>
      this.databases.user.findOneByUsername(loginData.username)
    );

    if (!user) {
      throw new BadRequestError("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid username or password");
    }

    const accessTokenPayload: AccessTokenPayloadType = {
      id: user.id,
    };
    const accessToken = this.generateAccessToken(accessTokenPayload);
    const mappedUser = this.mapper.mapToLoginUser(user, accessToken);
    return mappedUser;
  }

  private generateAccessToken(payload: AccessTokenPayloadType) {
    const accessToken = jwt.sign(payload, envData.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return accessToken;
  }

  async getAuthenticationStatus(userId: string) {
    console.log(userId);

    const user = await prismaErrorHandler(() =>
      this.databases.user.findOne(userId)
    );
    console.log(user);

    if (!user) {
      throw new NotFoundError("User could not be found");
    }

    return { username: user.username };
  }
}
