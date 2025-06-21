import { JotDB } from "../../db/jot.db";
import { JotGroupDB } from "../../db/jot_group.db";
import prisma from "../../db/prisma";
import { UserDB } from "../../db/user.db";
import { NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import parseFilename from "../../utils/parse_filename";
import {
  CreateJotRequestType,
  UpdateJotRequestType,
} from "../../zod/jot/jot.z";
import { IUser } from "../user/user.types";
import {
  IJot,
  IJotGroup,
  IJotGroupsWithCount,
  IJotWithoutId,
  IJotWithOwnerAndGroup,
} from "./jot.types";

export class JotService {
  private readonly jotDB: JotDB;
  private readonly jotGroupDB: JotGroupDB;
  private readonly userDB: UserDB;

  constructor() {
    this.jotDB = new JotDB();
    this.jotGroupDB = new JotGroupDB();
    this.userDB = new UserDB();
  }

  async create(jotData: CreateJotRequestType, userId: string) {
    const jotGroup: IJotGroup = await prismaErrorHandler<IJotGroup>(() =>
      this.jotGroupDB.createJotGroup(userId, jotData.description)
    );

    const mappedJots: IJotWithoutId[] = jotData.jots.map((jot) => {
      const nowDate = new Date();
      const { fileName, fileExtension } = parseFilename(jot.name);
      return {
        name: fileName,
        extension: fileExtension,
        content: jot.content,
        jotGroupId: jotGroup.id,
        createdAt: nowDate,
        updatedAt: nowDate,
      };
    });

    await this.jotDB.createManyJots(mappedJots);
  }

  async edit(jotData: UpdateJotRequestType, jotGroupId: string) {
    // this function recieved the a list of jots with theid name and content
    // along with the description of the jotGroup

    // updating even if the jot's content or name or description is exactly
    // the same is just unneccessay, so i need to setup a few conditions
    // still need to improve this code, but it works for now

    const jotGroup = await prismaErrorHandler<IJotGroup | null>(() =>
      this.jotGroupDB.findOneJotGroup(jotGroupId)
    );
    if (!jotGroup) {
      throw new NotFoundError("Jot was not found");
    }

    const jots = await prismaErrorHandler<IJot[]>(() =>
      this.jotDB.getJotsByGroupId(jotGroupId)
    );

    const recievedJotIds = jots.map((jot) => jot.id);
    const existingJots = jotData.jots.filter((jot) =>
      recievedJotIds.includes(jot.id)
    );
    const newJots = jotData.jots.filter(
      (jot) => !recievedJotIds.includes(jot.id)
    );

    /* 
      here, im performing multiple operations: 
        1. write to jotGroup table
        2. write to jot table (2x)
      
      so, if any one operation fails, i need to rollback
      for eg: updating description failed but updating content was a success
      so, this causes a inconsistent state because the user updated the jot but only content was changed
      not the description.
      
      to solve this, i need to use transactions.
    */

    await prisma.$transaction(async (tx) => {
      if (jotData.description !== jotGroup.description) {
        await prismaErrorHandler(() =>
          tx.jotGroup.update({
            where: {
              id: jotGroupId,
            },
            data: {
              description: jotData.description,
            },
          })
        );
      }

      // here, i loop through the entire array of jots we recieved
      // and update each jot that **exists** in the database, this is a
      // very inefficient way of doing things, but it works for now
      for (const jot of existingJots) {
        const { fileName, fileExtension } = parseFilename(jot.name);
        await prismaErrorHandler(() =>
          tx.jot.update({
            where: {
              id: jot.id,
            },
            data: {
              name: fileName,
              extension: fileExtension,
              content: jot.content,
            },
          })
        );
      }

      // here, i create new jots for newly added files. this is a batch insert
      // which improves performance significantly
      const mappedJots: IJotWithoutId[] = newJots.map((jot) => {
        const nowDate = new Date();
        const { fileName, fileExtension } = parseFilename(jot.name);
        return {
          name: fileName,
          extension: fileExtension,
          content: jot.content,
          jotGroupId,
          createdAt: nowDate,
          updatedAt: nowDate,
        };
      });

      await tx.jot.createMany({ data: mappedJots });
    });
  }

  async getAll(offset: number, limit: number) {
    const { jotGroups, count } = await prismaErrorHandler<IJotGroupsWithCount>(
      () => this.jotGroupDB.getAllJotGroups(offset, limit)
    );

    const allJots: IJotWithOwnerAndGroup[] = [];
    for (const group of jotGroups) {
      const jots = await prismaErrorHandler<IJot[]>(() =>
        this.jotDB.getJotsByGroupId(group.id)
      );

      const jotOwner = await prismaErrorHandler<IUser | null>(() =>
        this.userDB.findOneUserById(group.userId)
      );

      if (!jotOwner) {
        throw new Error("A Jot's owner was not found.");
      }
      const jotWithAuthorAndGroup: IJotWithOwnerAndGroup = {
        ...jots[0],
        owner: {
          id: jotOwner.id,
          name: jotOwner.username,
        },
        jotGroup: {
          id: group.id,
          totalFiles: jots.length,
          description: group.description,
        },
      };

      allJots.push(jotWithAuthorAndGroup);
    }

    return { jotGroups: allJots, count };
  }
}
