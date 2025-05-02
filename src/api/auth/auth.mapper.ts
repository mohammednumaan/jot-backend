import { IUser } from "../user/user.types";
import { IAuthLoginDTO, IAuthUserDTO } from "./auth.types";

export class AuthMapper {
  mapToSignupUser(user: IUser): IAuthUserDTO {
    return {
      email: user.email,
      username: user.email,
      avatar: user.avatar,
      joinedAt: user.joinedAt,
    };
  }

  mapToLoginUser(user: IUser, access_token: string): IAuthLoginDTO {
    return {
      user: {
        email: user.email,
        username: user.email,
        avatar: user.avatar,
        joinedAt: user.joinedAt,
      },
      accessToken: access_token,
    };
  }
}
