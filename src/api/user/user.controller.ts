import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import validate from "../../zod/validate";
import {
  GetJotGroupRequestSchema,
  GetJotGroupRequestType,
  GetJotGroupResponseSchema,
  GetJotGroupResponseType,
} from "../../zod/user/jotGroup.z";
import { ValidationError } from "../../errors/api/error";
import {
  createApiSuccessResponse,
  sendApiResponse,
} from "../../utils/response.utils";

export class UserController {
  private readonly userService: userService;
  constructor() {
    this.userService = new userService();
  }

  async getJotGroup(req: Request, res: Response, next: NextFunction) {
    const validationResult = validate<GetJotGroupRequestType>(
      GetJotGroupRequestSchema,
      req.params as unknown as { name: string; jotGroupId: string }
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error.flatten()
      );
    }

    const jots = await this.userService.getJotGroup(
      validationResult.data.jotGroupId
    );

    const responseData = {
      jots: jots,
    };
    const responseValidation = validate<GetJotGroupResponseType>(
      GetJotGroupResponseSchema,
      responseData
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    }

    const successResponse = createApiSuccessResponse(
      "Jots for the jotGroup retrieved successfully",
      200,
      responseValidation.data
    );

    return sendApiResponse(res, successResponse);
  }
}
