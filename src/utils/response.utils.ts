import { Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/api/error";

interface ApiSucessResponse<T> {
  success: boolean;
  message: string | null;
  statusCode: number;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string | null;
  apiErrorCode: string;
  statusCode: number;
  data: null;
  error: unknown;
}

function createApiSuccessResponse<T>(
  message: string | null,
  statusCode: number,
  data: T,
): ApiSucessResponse<T> {
  return {
    success: false,
    message,
    statusCode,
    data,
  };
}

function createApiErrorResponse(
  message: string | null,
  statusCode: number,
  apiErrorCode: string,
  error: unknown,
): ApiErrorResponse {
  return {
    success: false,
    statusCode,
    apiErrorCode,
    message,
    data: null,
    error,
  };
}

function sendApiResponse(
  res: Response,
  response: ApiSucessResponse<any> | ApiErrorResponse,
) {
  console.log("hi");
  return res.status(response.statusCode).json(response);
}

export {
  ApiSucessResponse,
  ApiErrorResponse,
  createApiSuccessResponse,
  createApiErrorResponse,
  sendApiResponse,
};
