import { JotDB } from "../../db/jot.db";
import { JotGroupDB } from "../../db/jot_group.db";
import { NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import { IJot, IJotGroup } from "../jot/jot.types";

export class userService {
  private readonly jotGroupDB: JotGroupDB;
  private readonly jotDB: JotDB;

  constructor() {
    this.jotDB = new JotDB();
    this.jotGroupDB = new JotGroupDB();
  }

  async getJotGroup(jotGroupId: string) {
    const jotGroup = await prismaErrorHandler<IJotGroup | null>(() =>
      this.jotGroupDB.findOneJotGroup(jotGroupId)
    );

    if (!jotGroup) {
      throw new NotFoundError("Jot group could not be found");
    }

    const jots = await prismaErrorHandler<IJot[]>(() =>
      this.jotDB.getJotsByGroupId(jotGroupId)
    );

    if (!jots.length) {
      throw new NotFoundError("Jot's for the Jot group could not be found");
    }

    return jots;
  }
}
