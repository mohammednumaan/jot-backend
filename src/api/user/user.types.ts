export interface IUser {
  id: string;
  password: string;
  username: string;
  avatar: string;
  joinedAt: Date;
}

export type IUserNew = Omit<IUser, "id" | "joinedAt">;
