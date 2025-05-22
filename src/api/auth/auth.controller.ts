import { NextFunction, Request, Response } from "express";
import {
  IAuthController,
  IAuthLoginDTO,
  IAuthStatus,
  IAuthUserDTO,
} from "./auth.types";
import validate from "../../zod/validate";

import { BadRequestError, UnauthorizedError, ValidationError } from "../../errors/api/error";
import { AuthService } from "./auth.service";
import {
  ApiSucessResponse,
  createApiSuccessResponse,
  sendApiResponse,
} from "../../utils/response.utils";
import {
  AuthSignupRequest,
  AuthSignupRequestSchema,
  AuthSignupResponse,
  AuthSignupResponseSchema,
} from "../../zod/auth/signup.z";
import {
  AuthLoginRequest,
  AuthLoginRequestSchema,
  AuthLoginResponse,
  AuthLoginResponseSchema,
} from "../../zod/auth/login.z";
import { envData } from "../../env";
import verifyToken from "../../utils/verify_token.utils";

export default class AuthController implements IAuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    const validationResult = validate<AuthSignupRequest>(
      AuthSignupRequestSchema,
      req.body
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error.flatten()
      );
    }
    const registeredUser: IAuthUserDTO = await this.authService.signup(
      validationResult.data
    );
    const responseData: AuthSignupResponse = {
      user: registeredUser,
    };

    const responseValidation = validate<AuthSignupResponse>(
      AuthSignupResponseSchema,
      responseData
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    }

    const successResponse = createApiSuccessResponse<AuthSignupResponse>(
      "User registered successfully",
      201,
      responseData
    );
    return sendApiResponse(res, successResponse);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const validationResult = validate<AuthLoginRequest>(
      AuthLoginRequestSchema,
      req.body
    );

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request body",
        "VALIDATION_ERROR",
        validationResult.error
      );
    }

    const loggedInUser = await this.authService.login(validationResult.data);
    const responseData: IAuthLoginDTO = {
      user: loggedInUser.user,
      accessToken: loggedInUser.accessToken,
    };

    const responseValidation = validate<AuthLoginResponse>(
      AuthLoginResponseSchema,
      responseData
    );

    if (!responseValidation.success) {
      throw new ValidationError(
        "Invalid response format",
        "VALIDATION_ERROR",
        responseValidation.error.flatten()
      );
    }

    const successResponse: ApiSucessResponse<AuthLoginResponse> = {
      success: true,
      message: "User logged-in successfully",
      statusCode: 200,
      data: { user: responseData.user },
    };

    res.cookie("jot_access_token", responseData.accessToken, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: envData.NODE_ENV === "production" ? true : false,
    });

    return res.status(successResponse.statusCode).json(successResponse);
  }

  async authenticationStatus(req: Request, res: Response, next: NextFunction) {
    const jwtCookie = req.cookies["jot_access_token"];
    if (!jwtCookie) {
      throw new UnauthorizedError("Unauthorized request");
    }

    // this throws an error if the jwt verification fails, which is then
    // caught by the asyncErrorHandler that wraps around the route which uses
    // this function (authenticationStatus)
    verifyToken(req, jwtCookie);  
    const successResponse: ApiSucessResponse<IAuthStatus> = {
      success: true,
      message: "Authentication status retrived successfully",
      statusCode: 200,
      data: { status: true },
    };

    return res.status(successResponse.statusCode).json(successResponse);
  }
}
