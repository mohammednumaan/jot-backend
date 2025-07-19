import { IJot, IJotNew, IJotWithoutId } from "../api/jot/jot.types";
import prisma from "./prisma";
import { IJotDatabase } from "./types";

export class JotDatabase implements IJotDatabase {
  async findOne(id: string): Promise<IJot | null> {
    return await prisma.jot.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findAll(offset: number, limit: number): Promise<IJot[]> {
    const jots = await prisma.jot.findMany({
      skip: offset,
      take: limit,
    });

    return jots;
  }

  async findByGroupId(groupId: string): Promise<IJot[]> {
    const jots = await prisma.jot.findMany({
      where: {
        jotGroupId: groupId,
      },
    });

    return jots;
  }

  async create(inputs: IJotNew) {
    const jot = await prisma.jot.create({
      data: {
        name: inputs.name,
        extension: inputs.extension,
        content: inputs.content,
        jotGroupId: inputs.jotGroupId,
      },
    });

    return jot;
  }

  async createMany(inputs: IJotNew[]) {
    await prisma.jot.createMany({
      data: inputs,
    });
  }

  async update(id: string, inputs: IJotNew): Promise<IJot> {
    const updatedJot = await prisma.jot.update({
      where: { id: id },
      data: {
        name: inputs.name,
        extension: inputs.extension,
        content: inputs.content,
        updatedAt: new Date(),
      },
    });

    return updatedJot;
  }

  async delete(id: string): Promise<void> {
    await prisma.jot.delete({
      where: {
        id: id,
      },
    });
  }
  async count(): Promise<number> {
    return await prisma.jot.count();
  }
}
