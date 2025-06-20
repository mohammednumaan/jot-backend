import { JotDB } from "../../db/jot.db";
import { JotGroupDB } from "../../db/jot_group.db";
import { UserDB } from "../../db/user.db";
import { NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import {
  IJot,
  IJotGroup,
  IJotGroupsWithCount,
  IJotWithOwnerAndGroup,
} from "../jot/jot.types";
import { IUser } from "./user.types";

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

    return {jots, description: jotGroup.description};
  }

  async getJotGroups(username: string, offset: number, limit: number) {

    // TODO: this code is exactly same as the on in jot.service.ts
    // i need to refactor this to avoid code duplication
    const user = await prismaErrorHandler<IUser | null>(() =>
      this.userDB.findOneUserByUsername(username),
    );
    if (!user) {
      throw new NotFoundError("User not found");
    };

    const { jotGroups, count } = await prismaErrorHandler<IJotGroupsWithCount>(
      () => this.jotGroupDB.getAllJotGroupsByUserId(user.id, offset, limit),
    );

    const allJots: IJotWithOwnerAndGroup[] = [];
    for (const group of jotGroups) {
      const jots = await prismaErrorHandler<IJot[]>(() =>
        this.jotDB.getJotsByGroupId(group.id),
      );

      const jotWithAuthorAndGroup: IJotWithOwnerAndGroup = {
        ...jots[0],
        owner: {
          id: user.id,
          name: user.username,
        },
        jotGroup: {
          id: group.id,
          totalFiles: jots.length,
          description: group.description
        },
      };

      allJots.push(jotWithAuthorAndGroup);
    }

    return { jotGroups: allJots, count };
  }
}
