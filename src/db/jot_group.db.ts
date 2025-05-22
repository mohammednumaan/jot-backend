import { IJotGroup } from "../api/jot/jot.types";
import prisma from "./prisma";

export class JotGroupDB {
    async createJotGroup(userId: string): Promise<IJotGroup>{
        const newJotGroup = await prisma.jotGroup.create({
            data: {
                user: {connect: {id: userId}},
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });

        return newJotGroup;
    }
}