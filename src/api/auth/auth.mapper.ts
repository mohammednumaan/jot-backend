import { IUser } from "../user/user.types";
import { IAuthLoginDTO, IAuthUserDTO } from "./auth.types";

export class AuthMapper {
  mapToSignupUser(user: IUser): IAuthUserDTO {
    return {
      username: user.username,
      avatar: user.avatar,
      joinedAt: user.joinedAt,
    };
  }

  mapToLoginUser(user: IUser, access_token: string): IAuthLoginDTO {
    return {
      user: {
        username: user.username,
        avatar: user.avatar,
        joinedAt: user.joinedAt,
      },
      accessToken: access_token,
    };
  }
}
