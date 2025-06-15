import { IUser } from "../user/user.types";

interface IAuthLoginDTO {
  user: IAuthUserDTO;
  accessToken: string;
}

interface IAuthStatusResponseType {
  status: boolean,
  username: string | null
}

type AccessTokenPayloadType = { id: string };
type IAuthUserDTO = Omit<IUser, "id" | "password">;
export { IAuthUserDTO, IAuthLoginDTO, AccessTokenPayloadType, IAuthStatusResponseType };
