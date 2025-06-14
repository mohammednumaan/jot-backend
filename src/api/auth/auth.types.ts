import { IUser } from "../user/user.types";

interface IAuthLoginDTO {
  user: IAuthUserDTO;
  accessToken: string;
}

type AccessTokenPayloadType = { id: string };
type IAuthUserDTO = Omit<IUser, "id" | "password">;
type AuthStatusType = { status: boolean };
export { IAuthUserDTO, IAuthLoginDTO, AccessTokenPayloadType, AuthStatusType };
