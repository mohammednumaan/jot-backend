import { IJotGroup, IJotGroupNew } from "../api/jot/jot.types";
import prisma from "./prisma";
import { IJotGroupDatabase } from "./types";

export class JotGroupDatabase implements IJotGroupDatabase {
  async findOne(jotGroupId: string) {
    const jotGroup = await prisma.jotGroup.findFirst({
      where: {
        id: jotGroupId,
      },
    });

    return jotGroup;
  }

  async findAll(offset: number, limit: number) {
    const jotGroups = await prisma.jotGroup.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    return jotGroups;
  }

  async findAllByUserId(
    id: string,
    offset: number,
    limit: number
  ): Promise<IJotGroup[]> {
    const jotGroups = await prisma.jotGroup.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: id,
      },
    });
    return jotGroups;
  }

  async create(inputs: IJotGroupNew): Promise<IJotGroup> {
    const newJotGroup = await prisma.jotGroup.create({
      data: {
        user: { connect: { id: inputs.userId } },
        description: inputs.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return newJotGroup;
  }

  async update(jotGroupId: string, inputs: IJotGroupNew): Promise<IJotGroup> {
    const updatedJotGroup = await prisma.jotGroup.update({
      where: { id: jotGroupId },
      data: {
        description: inputs.description || null,
        updatedAt: new Date(),
      },
    });

    return updatedJotGroup;
  }

  async delete(id: string) {
    await prisma.jotGroup.delete({
      where: { id: id },
    });
  }

  async count() {
    const jotGroupCount = await prisma.jotGroup.count();
    return jotGroupCount;
  }
}
