import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { IUser } from "../user/user.types";
import { AuthSignupRequest } from "../../zod/auth/signup.z";
import { AuthLoginRequest } from "../../zod/auth/login.z";

interface IAuthController {
  signup: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
}

interface IAuthService {
  signup: (signupData: AuthSignupRequest) => Promise<IAuthUserDTO>;
  login: (loginData: AuthLoginRequest) => Promise<IAuthLoginDTO>;
}

interface IAuthStatus {
  status: boolean;
}

type IAuthUserDTO = Omit<IUser, "id" | "password">;
interface IAuthLoginDTO {
  user: IAuthUserDTO;
  accessToken: string;
}

const AcessTokenPayloadSchema = z.object({
  id: z.string(),
});
type AccessTokenPayloadType = z.infer<typeof AcessTokenPayloadSchema>;

export {
  IAuthController,
  IAuthService,
  IAuthStatus,
  IAuthUserDTO,
  IAuthLoginDTO,
  AccessTokenPayloadType,
};
