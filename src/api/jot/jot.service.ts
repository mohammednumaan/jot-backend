import { JotDB } from "../../db/jot.db";
import { JotGroupDB } from "../../db/jot_group.db";
import { UserDB } from "../../db/user.db";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import { CreateJotRequestType } from "../../zod/jot/jot.z";
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
      this.jotGroupDB.createJotGroup(userId)
    );

    for (const jots of jotData.jots) {
      const jotNameArr = jots.name.split(".");
      const jotExtension = jotNameArr[jotNameArr.length - 1];
      const jotName = jotNameArr.slice(0, jotNameArr.length - 1).join(".");
      const jot: IJot = await prismaErrorHandler<IJot>(() =>
        this.jotDB.createJot(
          jotName,
          jotExtension,
          jotData.description,
          jots.content,
          jotGroup.id
        )
      );
    }
  }

  async getAll(offset: number, limit: number) {
    const { jotGroups, count } = await prismaErrorHandler<IJotGroupsWithCount>(
      () => this.jotGroupDB.getAllJotGroups(offset, limit)
    );

    let allJots: IJotWithOwnerAndGroup[] = [];
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
        },
      };

      allJots.push(jotWithAuthorAndGroup);
    }

    return { jotGroups: allJots, count };
  }
}
