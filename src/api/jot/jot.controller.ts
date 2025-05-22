import { NextFunction, Request, Response } from "express";
import { JotService } from "./jot.service";
import { IJotController, IJotDTO } from "./jot.types";
import validate from "../../zod/validate";
import { allJotsResponseSchema, AllJotsType, JotRequestSchema, JotRequestType, JotResponseSchema, JotResponseType } from "../../zod/jot/jot.z";
import { ValidationError } from "../../errors/api/error";
import { createApiSuccessResponse, sendApiResponse } from "../../utils/response.utils";

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

    const createdJot: IJotDTO = await this.jotService.create(validationResult.data, req.user.id);
    const responseData: JotResponseType = {
        jot: createdJot
    }

    const responseValidation = validate<JotResponseType>(
      JotResponseSchema,
      responseData
    )

    if (!responseValidation.success){
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    };

    const successResponse = createApiSuccessResponse<JotResponseType>(
        "Jot created successfully",
        201,
        responseData
    )

    return sendApiResponse(res, successResponse);
    
  };

  async getAll(req: Request, res: Response, next: NextFunction){
    const allJots = await this.jotService.getAll();

    const responseData: AllJotsType = {
      jots: allJots
    }

    const responseValidation = validate<AllJotsType>(
      allJotsResponseSchema,
      responseData
    )
    
    if (!responseValidation.success){
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    };

    const successResponse = createApiSuccessResponse<AllJotsType>(
        "Jot retrieved successfully",
        200,
        responseValidation.data
    )

    return sendApiResponse(res, successResponse);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const jotId = req.params.jotId;
    const jot: IJotDTO = await this.jotService.getById(jotId);
    const responseData: JotResponseType = {
        jot
    }

    const responseValidation = validate<JotResponseType>(
      JotResponseSchema,
      responseData
    )

    if (!responseValidation.success){
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    };

    const successResponse = createApiSuccessResponse<JotResponseType>(
        "Jot retrieved successfully",
        200,
        responseData
    )

    return sendApiResponse(res, successResponse);
  };
}
