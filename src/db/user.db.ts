import prisma from "./prisma";
import { IUser } from "../api/user/user.types";

export class UserDB {
  async findOneUserByUsername(username: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    return user;
  }

  async findOneUserById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  }

  async createUser(
    username: string,
    password: string,
  ): Promise<IUser> {
    const newUser = await prisma.user.create({
      data: {
        username: username || "new_user",
        password,
        avatar: "",
        joinedAt: new Date(),
      },
    });
    return newUser;
  }
}
