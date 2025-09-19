import { Databases } from "../../db/index.db";
import { NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import JotMapper from "../jot/jot.mapper";
import { IJot, IJotGroup, IJotWithOwnerAndGroup } from "../jot/jot.types";
import { IUser, IUserNew } from "./user.types";

export class userService {
  private readonly databases: Databases;
  private readonly mapper: JotMapper;

  constructor() {
    this.databases = new Databases();
    this.mapper = new JotMapper();
  }

  async getJotGroupById(jotGroupId: string, username: string) {
    console.log("user id", username);

    const user = await prismaErrorHandler<IUser | null>(() =>
      this.databases.user.findOneByUsername(username)
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }
    console.log("made it here", user);

    const jotGroup = await prismaErrorHandler<IJotGroup | null>(() =>
      this.databases.jotGroups.findOne(jotGroupId)
    );

    if (!jotGroup) {
      throw new NotFoundError("Jot group could not be found");
    }

    const jots = await prismaErrorHandler<IJot[]>(() =>
      this.databases.jots.findByGroupId(jotGroupId)
    );

    if (!jots.length) {
      throw new NotFoundError("Jot's for the Jot group could not be found");
    }

    return this.mapper.mapToJotsWithOwnerAndGroup(jots, user, jotGroup);
  }

  async getJotGroups(username: string, offset: number, limit: number) {
    // TODO: this code is exactly same as the on in jot.service.ts
    // i need to refactor this to avoid code duplication
    const user = await prismaErrorHandler<IUser | null>(() =>
      this.databases.user.findOneByUsername(username)
    );
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const jotGroups = await prismaErrorHandler(() =>
      this.databases.jotGroups.findAllByUserId(user.id, offset, limit)
    );

    const allJots: IJotWithOwnerAndGroup[] = [];
    for (const group of jotGroups) {
      const jots = await prismaErrorHandler<IJot[]>(() =>
        this.databases.jots.findByGroupId(group.id)
      );

      const jotWithAuthorAndGroup: IJotWithOwnerAndGroup =
        this.mapper.mapToSingleJotWithOwner(jots[0], user, group, jots.length);

      allJots.push(jotWithAuthorAndGroup);
    }

    return { jotGroups: allJots, count: jotGroups.length };
  }
}
