import { IJot } from "../api/jot/jot.types";
import prisma from "./prisma";

export class JotDB {
  async createJot(
    name: string,
    extension: string,
    content: string,
    jotGroupId: string
  ): Promise<IJot> {
    const createdAt = new Date();
    const newJot = await prisma.jot.create({
      data: {
        name,
        extension,
        content,
        createdAt: createdAt,
        updatedAt: createdAt,
        jotGroup: { connect: { id: jotGroupId } },
      },
    });

    return newJot;
  }

  async getAllJots(offset: number, limit: number): Promise<IJot[]> {
    const jots = await prisma.jot.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    return jots;
  }

  async updateJot(
    jotId: string,
    name: string,
    extension: string,
    content: string
  ) {
    const updatedJot = await prisma.jot.update({
      where: { id: jotId },
      data: {
        name: name,
        extension: extension,
        content: content,
        updatedAt: new Date(),
      },
    });

    return updatedJot;
  }

  async getAllJotsCount(): Promise<number> {
    const count = await prisma.jot.count();
    return count;
  }

  async getJotById(jotId: string): Promise<IJot | null> {
    const jot = await prisma.jot.findFirst({
      where: {
        id: jotId,
      },
    });

    return jot;
  }

  async getJotsByGroupId(jotGroupId: string) {
    const jots = await prisma.jot.findMany({
      where: {
        jotGroupId: jotGroupId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return jots;
  }
}
