import { JotDB } from "../../db/jot.db";
import { JotGroupDB } from "../../db/jot_group.db";
import { NotFoundError } from "../../errors/api/error";
import { prismaErrorHandler } from "../../errors/prisma/errors.prisma";
import { JotRequestType } from "../../zod/jot/jot.z";
import { JotMapper } from "./jot.mapper";
import { IJot, IJotDTO, IJotGroup, IJotService } from "./jot.types";

export class JotService implements IJotService {
  private readonly jotDB: JotDB;
  private readonly jotGroupDB: JotGroupDB;
  private readonly mapper: JotMapper;

  constructor() {
    this.jotDB = new JotDB();
    this.jotGroupDB = new JotGroupDB();
    this.mapper = new JotMapper();
  }

  async create(jotData: JotRequestType, userId: string) {
    const jotGroup: IJotGroup = await prismaErrorHandler<IJotGroup>(() =>
      this.jotGroupDB.createJotGroup(userId)
    );

    const createdDate = new Date();
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
    const jotGroups = await prismaErrorHandler<IJotGroup[]>(() =>
      this.jotGroupDB.getAllJotGroups(offset, limit)
    );

    let jots: IJot[] = [];
    for (const group of jotGroups) {
      const jot = await prismaErrorHandler<IJot[]>(() =>
        this.jotDB.getFirstJotByGroupId(group.id)
      );
      console.log(jot);

      jots.push(jot[0]);
    }
    return jots;
  }

  async getAllCount() {
    const count = await prismaErrorHandler<number>(() =>
      this.jotDB.getAllJotsCount()
    );
    return count;
  }

  async getById(jotId: string) {
    const jot = await prismaErrorHandler<IJot | null>(() =>
      this.jotDB.getJotById(jotId)
    );

    if (!jot) {
      throw new NotFoundError("A Jot with the given ID was not found");
    }

    return jot;
  }
}
