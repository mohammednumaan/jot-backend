import { IUser, IUserNew } from "../api/user/user.types";
import prisma from "./prisma";
import { IUserDatabase } from "./types";

export class UserDatabase implements IUserDatabase {
  async findOne(id: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findAll(offset: number, limit: number): Promise<IUser[]> {
    const users = await prisma.user.findMany({
      skip: offset,
      take: limit,
    });

    return users;
  }

  async findOneByUsername(username: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    return user;
  }

  async create(inputs: IUserNew) {
    const newUser = await prisma.user.create({
      data: {
        username: inputs.username || "new_user",
        password: inputs.password,
        avatar: inputs.avatar || "",
        joinedAt: new Date(),
      },
    });

    return newUser;
  }

  async update(id: string, inputs: IUser): Promise<IUser> {
    const updatedUser = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        ...inputs
      }
    })

    return updatedUser;
  }

  async delete(id: string) {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
