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

    const jotNameArr = jotData.filename.split(".");
    const jotExtension = jotNameArr[jotNameArr.length - 1];
    const jotName = jotNameArr.slice(0, jotNameArr.length - 1).join(".");
    const jot: IJot = await prismaErrorHandler<IJot>(() =>
      this.jotDB.createJot(
        jotName,
        jotExtension,
        jotData.description,
        jotData.fileContent,
        jotGroup.id
      )
    );

    const mappedJot: IJotDTO = this.mapper.mapToNewJot(jot);
    return mappedJot;
  }

  async getAll() {
    const jots = await prismaErrorHandler<IJot[]>(() =>
      this.jotDB.getAllJots()
    );
    return jots;
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
