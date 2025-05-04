import prisma from "./prisma";
import { IUser } from "../api/user/user.types";

export class UserDB {
  async findOneUser(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async createUser(
    email: string,
    password: string,
    username: string,
  ): Promise<IUser> {
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        username: username || "new_user",
        avatar: "",
        joinedAt: new Date(),
      },
    });
    return newUser;
  }
}
