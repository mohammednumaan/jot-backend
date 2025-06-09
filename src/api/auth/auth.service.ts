import { UserDB } from "../../db/user.db";
import bcrypt from "bcrypt";
import {
  IAuthLoginDTO,
  IAuthService,
  IAuthUserDTO,
} from "./auth.types";
import jwt from "jsonwebtoken";
import { AuthSignupRequest } from "../../zod/auth/signup.z";
import { AccessTokenPayloadType, AuthLoginRequest } from "../../zod/auth/login.z";
import { BadRequestError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import { envData } from "../../env";
import { IUser } from "../user/user.types";
import { AuthMapper } from "./auth.mapper";

export class AuthService implements IAuthService {
  private readonly userDB: UserDB;
  private readonly mapper: AuthMapper;
  constructor() {
    this.mapper = new AuthMapper();
    this.userDB = new UserDB();
  }
  async signup(signupData: AuthSignupRequest): Promise<IAuthUserDTO> {
    const existingUser = await this.userDB.findOneUserByEmail(signupData.email);
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(
      signupData.password,
      envData.SALT_ROUNDS,
    );
    const user: IUser = await prismaErrorHandler<IUser>(() =>
      this.userDB.createUser(
        signupData.email,
        hashedPassword,
        signupData.username,
      ),
    );

    const mapperUser: IAuthUserDTO = this.mapper.mapToSignupUser(user);
    return mapperUser;
  }

  async login(loginData: AuthLoginRequest): Promise<IAuthLoginDTO> {
    const user = await prismaErrorHandler<IUser | null>(() =>
      this.userDB.findOneUserByEmail(loginData.email),
    );

    if (!user) {
      throw new BadRequestError("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
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
}
