import { IJot } from "../api/jot/jot.types";
import prisma from "./prisma";

export class JotDB {
  async createJot(
    name: string,
    extension: string,
    description: string | null,
    content: string,
    jotGroupId: string
  ): Promise<IJot> {
    const newJot = await prisma.jot.create({
      data: {
        name,
        extension,
        description,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        jotGroup: { connect: { id: jotGroupId } },
      },
    });

    return newJot;
  }

  async getAllJots(): Promise<IJot[]>{
    const jots = await prisma.jot.findMany();
    return jots;
  }

  async getJotById(jotId: string): Promise<IJot | null>{
    const jot = await prisma.jot.findFirst({
      where: {
        id: jotId,
      },
    });

    return jot;
  }
}
