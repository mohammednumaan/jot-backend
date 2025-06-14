import { JotDB } from "../../db/jot.db";
import { JotGroupDB } from "../../db/jot_group.db";
import { UserDB } from "../../db/user.db";
import { NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import {
  IJot,
  IJotGroup,
  IJotGroupWithFileCount,
} from "../jot/jot.types";

export class userService {
  private readonly jotGroupDB: JotGroupDB;
  private readonly jotDB: JotDB;
  private readonly userDB: UserDB;

  constructor() {
    this.jotDB = new JotDB();
    this.jotGroupDB = new JotGroupDB();
    this.userDB = new UserDB();
  }

  async getJotGroupById(jotGroupId: string) {
    const jotGroup = await prismaErrorHandler<IJotGroup | null>(() =>
      this.jotGroupDB.findOneJotGroup(jotGroupId),
    );

    if (!jotGroup) {
      throw new NotFoundError("Jot group could not be found");
    }

    const jots = await prismaErrorHandler<IJot[]>(() =>
      this.jotDB.getJotsByGroupId(jotGroupId),
    );

    if (!jots.length) {
      throw new NotFoundError("Jot's for the Jot group could not be found");
    }

    return jots;
  }

  async getJotGroups(username: string, offset: number, limit: number) {
    const user = await prismaErrorHandler(() =>
      this.userDB.findOneUserByUsername(username),
    );

    if (!user) {
      throw new NotFoundError("The requested user could not be found");
    }

    const { jotGroups, count } = await prismaErrorHandler(() =>
      this.jotGroupDB.getAllJotGroupsByUserId(user.id, offset, limit),
    );

    if (!count) {
      return {
        jotGroups: [],
        count: 0,
      };
    }

    const allJotGroups: IJotGroupWithFileCount[] = [];
    for (const group of jotGroups) {
      const jots = await prismaErrorHandler<IJot[]>(() =>
        this.jotDB.getJotsByGroupId(group.id),
      );

      const jotGroupWithFileCount: IJotGroupWithFileCount = {
        ...group,
        totalFiles: jots.length,
      };

      allJotGroups.push(jotGroupWithFileCount);
    }

    return { jotGroups: allJotGroups, count };
  }
}
