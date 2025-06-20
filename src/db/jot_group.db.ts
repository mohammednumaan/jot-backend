import { IJotGroup } from "../api/jot/jot.types";
import prisma from "./prisma";

export class JotGroupDB {
  async findOneJotGroup(jotGroupId: string) {
    const jotGroup = await prisma.jotGroup.findFirst({
      where: {
        id: jotGroupId,
      },
    });

    return jotGroup;
  }

  async createJotGroup(
    userId: string,
    description: string | null
  ): Promise<IJotGroup> {
    const newJotGroup = await prisma.jotGroup.create({
      data: {
        user: { connect: { id: userId } },
        description: description,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return newJotGroup;
  }

  async updateJotGroup(jotGroupId: string, description: string | null) {
    const updatedJotGroup = await prisma.jotGroup.update({
      where: { id: jotGroupId },
      data: {
        description: description,
        updatedAt: new Date(),
      },
    });

    return updatedJotGroup;
  }

  async getAllJotGroups(offset: number, limit: number) {
    const jotGroups = await prisma.jotGroup.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    return { jotGroups, count: jotGroups.length };
  }

  async getAllJotGroupsByUserId(userId: string, offset: number, limit: number) {
    const jotGroups = await prisma.jotGroup.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: userId,
      },
    });
    return { jotGroups, count: jotGroups.length };
  }
}
