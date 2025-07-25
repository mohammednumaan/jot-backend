import { NextFunction, Request, Response } from "express";
import { JotService } from "./jot.service";
import validate from "../../zod/validate";
import {
  GetAllJotsRequestSchema,
  GetAllJotsRequestType,
  GetAllJotResponseType,
  CreateJotRequestSchema,
  CreateJotRequestType,
  GetAllJotsResponseSchema,
  UpdateJotRequestType,
  UpdateJotRequestSchema,
  DeleteJotRequestType,
  DeleteJotRequestSchema,
} from "../../zod/jot/jot.z";
import { ValidationError } from "../../errors/api/error";
import {
  createApiSuccessResponse,
  sendApiResponse,
} from "../../utils/response.utils";

export default class JotController {
  private readonly jotService: JotService;
  constructor() {
    this.jotService = new JotService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const validationResult = validate<CreateJotRequestType>(
      CreateJotRequestSchema,
      req.body
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error.flatten()
      );
    }
    await this.jotService.create(validationResult.data, req.user.id);

    const successResponse = createApiSuccessResponse(
      "Jot created successfully",
      201,
      null
    );

    return sendApiResponse(res, successResponse);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const validationResult = validate<GetAllJotsRequestType>(
      GetAllJotsRequestSchema,
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

    const { jotGroups, count } = await this.jotService.getAll(
      offset,
      requestedLimit,
      req.user.id
    );
    const totalPages = Math.ceil(count / requestedLimit);

    if (totalPages && requestedPage > totalPages) {
      throw new ValidationError(
        "Invalid page number",
        "VALIDATION_ERROR",
        `Page must be between 1 and ${totalPages}`
      );
    }

    const responseData: GetAllJotResponseType = {
      jots: jotGroups,
      pagination: {
        page: requestedPage,
        size: requestedLimit,
        totalPages: totalPages,
      },
    };

    const responseValidation = validate<GetAllJotResponseType>(
      GetAllJotsResponseSchema,
      responseData
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    }

    const successResponse = createApiSuccessResponse<GetAllJotResponseType>(
      "Jot retrieved successfully",
      200,
      responseValidation.data
    );

    return sendApiResponse(res, successResponse);
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    const validationResult = validate<UpdateJotRequestType>(
      UpdateJotRequestSchema,
      req.body
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error.flatten()
      );
    }
    await this.jotService.update(validationResult.data, req.params.jotGroupId);
    const successResponse = createApiSuccessResponse(
      "Jot updated successfully",
      200,
      null
    );

    return sendApiResponse(res, successResponse);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    console.log(req.params);
    
    const validationResult = validate<DeleteJotRequestType>(
      DeleteJotRequestSchema,
      req.params as unknown as { jotGroupId: string }
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request paramter",
        "VALIDATION_ERROR",
        validationResult.error.flatten()
      );
    }

    await this.jotService.delete(validationResult.data.jotGroupId);
    const successResponse = createApiSuccessResponse(
      "Jot deleted successfully",
      200,
      null
    );

    return sendApiResponse(res, successResponse);
  }
}
