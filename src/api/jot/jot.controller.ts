import { NextFunction, Request, Response } from "express";
import { JotService } from "./jot.service";
import { IJotController, IJotDTO } from "./jot.types";
import validate from "../../zod/validate";
import {
  allJotsRequestSchema,
  AllJotsRequestType,
  allJotsResponseSchema,
  AllJotsType,
  JotRequestSchema,
  JotRequestType,
  JotResponseSchema,
  JotResponseType,
} from "../../zod/jot/jot.z";
import { ValidationError } from "../../errors/api/error";
import {
  createApiSuccessResponse,
  sendApiResponse,
} from "../../utils/response.utils";

export default class JotController implements IJotController {
  private readonly jotService: JotService;
  constructor() {
    this.jotService = new JotService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const validationResult = validate<JotRequestType>(
      JotRequestSchema,
      req.body
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error.flatten()
      );
    }

    const createdJot: IJotDTO = await this.jotService.create(
      validationResult.data,
      req.user.id
    );
    const responseData: JotResponseType = {
      jot: createdJot,
    };

    const responseValidation = validate<JotResponseType>(
      JotResponseSchema,
      responseData
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    }

    const successResponse = createApiSuccessResponse<JotResponseType>(
      "Jot created successfully",
      201,
      responseData
    );

    return sendApiResponse(res, successResponse);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const validationResult = validate<AllJotsRequestType>(
      allJotsRequestSchema,
      req.query as unknown as { page: number }
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error.flatten()
      );
    }

    const requestedPage = validationResult.data.page;
    const requestedLimit = 10;
    const offset = (requestedPage - 1) * requestedLimit;

    const allJotsCount = await this.jotService.getAllCount();

    const allJots = await this.jotService.getAll(offset, requestedLimit);
    const totalPages = Math.ceil(allJotsCount / requestedLimit);

    if (requestedPage > totalPages) {
      throw new ValidationError(
        "Invalid page number",
        "VALIDATION_ERROR",
        `Page must be between 1 and ${totalPages}`
      );
    }

    const responseData: AllJotsType = {
      jots: allJots,
      pagination: {
        page: requestedPage,
        size: requestedLimit,
        totalPages: totalPages,
      },
    };

    const responseValidation = validate<AllJotsType>(
      allJotsResponseSchema,
      responseData
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    }

    const successResponse = createApiSuccessResponse<AllJotsType>(
      "Jot retrieved successfully",
      200,
      responseValidation.data
    );

    return sendApiResponse(res, successResponse);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const jotId = req.params.jotId;
    const jot: IJotDTO = await this.jotService.getById(jotId);
    const responseData: JotResponseType = {
      jot,
    };

    const responseValidation = validate<JotResponseType>(
      JotResponseSchema,
      responseData
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    }

    const successResponse = createApiSuccessResponse<JotResponseType>(
      "Jot retrieved successfully",
      200,
      responseData
    );

    return sendApiResponse(res, successResponse);
  }
}
