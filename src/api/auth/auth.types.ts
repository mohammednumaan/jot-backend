import { IUser } from "../user/user.types";

interface IAuthLoginDTO {
  user: IAuthUserDTO;
  accessToken: string;
}

type IAuthUserDTO = Omit<IUser, "id" | "password">;
type AuthStatusType = { status: boolean };
export { IAuthUserDTO, IAuthLoginDTO, AuthStatusType };
