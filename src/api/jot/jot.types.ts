import { NextFunction, Request, Response } from "express";
import { JotRequestType } from "../../zod/jot/jot.z";

interface IJotController {
  create: (req: Request, res: Response, next: NextFunction) => void;
  getById: (req: Request, res: Response, next: NextFunction) => void;
  getAll: (req: Request, res: Response, next: NextFunction) => void;
}

interface IJotService {
  create: (jotData: JotRequestType, userId: string) => Promise<IJotDTO>;
  getById: (jotId: string, userId: string) => Promise<IJot>;
  getAll: (offset: number, limit: number) => Promise<IJot[]>;
}

interface IJot {
  id: string;
  name: string;
  extension: string;
  description: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  jotGroupId: string;
}

interface IJotGroup {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

type IJotDTO = Omit<IJot, "id" | "updatedAt" | "jotGroupId">;
export { IJotController, IJotService, IJot, IJotGroup, IJotDTO };
