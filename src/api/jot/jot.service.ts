import { JotDB } from "../../db/jot.db";
import { JotGroupDB } from "../../db/jot_group.db";
import { UserDB } from "../../db/user.db";
import { NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import {
  CreateJotRequestType,
  UpdateJotRequestType,
} from "../../zod/jot/jot.z";
import { IUser } from "../user/user.types";
import {
  IJot,
  IJotGroup,
  IJotGroupsWithCount,
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

    for (const jots of jotData.jots) {
      const jotNameArr = jots.name.split(".");
      const jotExtension = jotNameArr[jotNameArr.length - 1];
      const jotName = jotNameArr.slice(0, jotNameArr.length - 1).join(".");
      await prismaErrorHandler<IJot>(() =>
        this.jotDB.createJot(jotName, jotExtension, jots.content, jotGroup.id)
      );
    }
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

    const ids = jots.map((jot) => jot.id);
    const existingJots = jotData.jots.filter((jot) => ids.includes(jot.id));
    const newJots = jotData.jots.filter((jot) => !ids.includes(jot.id));

    // if the description is **not** the same, we update the jotGroup
    if (jotData.description !== jotGroup.description) {
      await prismaErrorHandler(() =>
        this.jotGroupDB.updateJotGroup(jotGroupId, jotData.description)
      );
    }

    // here, i loop through the entire array of jots we recieved
    // and update each jot that **exists** in the database, this is a
    // very inefficient way of doing things, but it works for now
    for (const file of existingJots) {
      const jotNameArr = file.name.split(".");
      const extension = jotNameArr[jotNameArr.length - 1];
      const name = jotNameArr.slice(0, jotNameArr.length - 1).join(".");

      await prismaErrorHandler(() =>
        this.jotDB.updateJot(file.id, name, extension, file.content)
      );
    }

    // similarly, i create new jots for newly added files
    // for the same jotGroup, this is a very inefficient way of doing things
    // but it works for now
    for (const newJot of newJots) {
      const jotNameArr = newJot.name.split(".");
      const extension = jotNameArr[jotNameArr.length - 1];
      const name = jotNameArr.slice(0, jotNameArr.length - 1).join(".");
      await prismaErrorHandler(() =>
        this.jotDB.createJot(name, extension, newJot.content, jotGroupId)
      );
    }
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
