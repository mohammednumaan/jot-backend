import { Databases } from "../../db/index.db";
import prisma from "../../db/prisma";
import { BadRequestError, NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import parseFilename from "../../utils/parse_filename";
import {
  CreateJotRequestType,
  UpdateJotRequestType,
} from "../../zod/jot/jot.z";
import { IUser } from "../user/user.types";
import JotMapper from "./jot.mapper";
import {
  IJot,
  IJotGroup,
  IJotWithoutId,
  IJotWithOwnerAndGroup,
} from "./jot.types";

export class JotService {
  private readonly databases: Databases;
  private readonly mapper: JotMapper;

  constructor() {
    this.databases = new Databases();
    this.mapper = new JotMapper();
  }

  async create(jotData: CreateJotRequestType, userId: string) {
    const jotGroup: IJotGroup = await prismaErrorHandler<IJotGroup>(() =>
      this.databases.jotGroups.create({
        userId,
        description: jotData.description,
      })
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

    await this.databases.jots.createMany(mappedJots);
  }

  async update(jotData: UpdateJotRequestType, jotGroupId: string) {
    // this function recieved the a list of jots with theid name and content
    // along with the description of the jotGroup

    // updating even if the jot's content or name or description is exactly
    // the same is just unneccessay, so i need to setup a few conditions
    // still need to improve this code, but it works for now

    const jotGroup = await prismaErrorHandler<IJotGroup | null>(() =>
      this.databases.jotGroups.findOne(jotGroupId)
    );
    if (!jotGroup) {
      throw new NotFoundError("Jot was not found");
    }

    const jots = await prismaErrorHandler<IJot[]>(() =>
      this.databases.jots.findByGroupId(jotGroupId)
    );

    if (jots.length == 1 && jotData.deleted.length == 1) {
      throw new BadRequestError(
        "Cannot delete file. This jot contains only one file. Please delete the jot instead."
      );
    }

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
      await prismaErrorHandler(() =>
        tx.jot.deleteMany({
          where: {
            id: { in: jotData.deleted },
          },
        })
      );

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

  async delete(jotGroupId: string) {
    const jotGroup = await prismaErrorHandler(() =>
      this.databases.jotGroups.findOne(jotGroupId)
    );

    if (!jotGroup) {
      throw new NotFoundError("Jot not found");
    }

    await prismaErrorHandler(() => this.databases.jotGroups.delete(jotGroupId));
  }

  async deleteJotFile(jotGroupId: string, jotId: string) {
    const jotGroup = await prismaErrorHandler(() =>
      this.databases.jotGroups.findOne(jotGroupId)
    );

    if (!jotGroup) {
      throw new NotFoundError("Jot not found");
    }

    const jotCounts = await prismaErrorHandler(() =>
      this.databases.jots.findByGroupId(jotGroupId)
    );

    if (jotCounts.length == 1) {
      throw new BadRequestError(
        "Cannot delete file. This jot contains only one file. Please delete the jot instead."
      );
    }

    const fileExists = await prismaErrorHandler(() =>
      this.databases.jots.findOne(jotId)
    );

    if (!fileExists) {
      throw new NotFoundError("File not found");
    }

    await prismaErrorHandler(() => this.databases.jots.delete(jotId));
  }

  async getAll(offset: number, limit: number, userId: string) {
    const user = await prismaErrorHandler<IUser | null>(() =>
      this.databases.user.findOne(userId)
    );
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const jotGroups = await prismaErrorHandler(() =>
      this.databases.jotGroups.findAll(offset, limit)
    );

    const count = await prismaErrorHandler(() =>
      this.databases.jotGroups.count()
    );

    const allJots: IJotWithOwnerAndGroup[] = [];
    for (const group of jotGroups) {
      const jots = await prismaErrorHandler<IJot[]>(() =>
        this.databases.jots.findByGroupId(group.id)
      );

      const jotOwner = await prismaErrorHandler<IUser | null>(() =>
        this.databases.user.findOne(group.userId)
      );

      if (!jotOwner) {
        throw new Error("A Jot's owner was not found.");
      }
      const jotWithAuthorAndGroup: IJotWithOwnerAndGroup =
        this.mapper.mapToSingleJotWithOwner(jots[0], user, group, jots.length);

      allJots.push(jotWithAuthorAndGroup);
    }

    return { jotGroups: allJots, count };
  }
}
