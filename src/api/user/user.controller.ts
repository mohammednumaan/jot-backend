import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import validate from "../../zod/validate";
import {
  GetAllJotGroupsByUserIdRequestSchema,
  GetAllJotGroupsByUserIdRequestType,
  GetAllJotGroupsByUserIdResponseSchema,
  GetAllJotGroupsByUserIdResponseType,
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
      req.params as unknown as { name: string; jotGroupId: string },
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error.flatten(),
      );
    }

    const jots = await this.userService.getJotGroupById(
      validationResult.data.jotGroupId,
    );

    const responseData = {
      jots: jots,
    };
    const responseValidation = validate<GetJotGroupResponseType>(
      GetJotGroupResponseSchema,
      responseData,
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten(),
      );
    }

    const successResponse = createApiSuccessResponse(
      "Jots for the jotGroup retrieved successfully",
      200,
      responseValidation.data,
    );

    return sendApiResponse(res, successResponse);
  }

  async getJots(req: Request, res: Response, next: NextFunction) {
    const params = {
      page: typeof req.query.page === "string" ? parseInt(req.query.page) : 1,
      name: req.params.name,
    };
    const validationResult = validate<GetAllJotGroupsByUserIdRequestType>(
      GetAllJotGroupsByUserIdRequestSchema,
      params,
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error.flatten(),
      );
    }

    const requestedPage = validationResult.data.page;
    const requestedLimit = 10;
    const offset = (requestedPage - 1) * requestedLimit;

    const { jotGroups, count } = await this.userService.getJotGroups(
      validationResult.data.name,
      offset,
      requestedLimit,
    );
    const totalPages = Math.ceil(count / requestedLimit);

    if (totalPages && requestedPage > totalPages) {
      throw new ValidationError(
        "Invalid page number",
        "VALIDATION_ERROR",
        `Page must be between 1 and ${totalPages}`,
      );
    }

    const responseData: GetAllJotGroupsByUserIdResponseType = {
      jots: jotGroups,
      pagination: {
        page: requestedPage,
        size: requestedLimit,
        totalPages: totalPages,
      },
    };

    const responseValidation = validate<GetAllJotGroupsByUserIdResponseType>(
      GetAllJotGroupsByUserIdResponseSchema,
      responseData,
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten(),
      );
    }

    const successResponse =
      createApiSuccessResponse<GetAllJotGroupsByUserIdResponseType>(
        "Jots retrieved successfully",
        200,
        responseValidation.data,
      );

    return sendApiResponse(res, successResponse);
  }
}
