import { UserDB } from "../../db/user.db";
import bcrypt from "bcrypt";
import {
  AccessTokenPayloadType,
  IAuthLoginDTO,
  IAuthService,
  IAuthUserDTO,
} from "./auth.types";
import jwt from "jsonwebtoken";
import { AuthSignupRequest } from "../../zod/auth/signup.z";
import { AuthLoginRequest } from "../../zod/auth/login.z";
import { BadRequestError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import { envData } from "../../env";

export class AuthService implements IAuthService {
  private readonly userDB: UserDB;
  constructor() {
    this.userDB = new UserDB();
  }
  async signup(signupData: AuthSignupRequest): Promise<IAuthUserDTO> {
    const existingUser = await this.userDB.findOneUser(signupData.email);
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(
      signupData.password,
      envData.SALT_ROUNDS,
    );
    console.log(hashedPassword);
    const user: IAuthUserDTO = await prismaErrorHandler<IAuthUserDTO>(() =>
      this.userDB.createUser(
        signupData.email,
        hashedPassword,
        signupData.username,
        signupData.avatar,
      ),
    );

    return user;
  }

  async login(loginData: AuthLoginRequest): Promise<IAuthLoginDTO> {
    const user = await prismaErrorHandler(() =>
      this.userDB.findOneUser(loginData.email),
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
      email: user.email,
    };
    const accessToken = this.generateAccessToken(accessTokenPayload);
    const userWithoutPassword: IAuthUserDTO = {
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      joinedAt: user.joinedAt,
    };

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  private generateAccessToken(payload: AccessTokenPayloadType) {
    const accessToken = jwt.sign(payload, envData.ACCESS_TOKEN_SECRET, {
      expiresIn: "10h",
    });
    return accessToken;
  }
}
