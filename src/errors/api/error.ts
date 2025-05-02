export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly apiErrorCode: string;
  public readonly description?: unknown;

  constructor(
    message: string,
    statusCode: number,
    apiErrorCode: string,
    description?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.apiErrorCode = apiErrorCode;
    this.description = description;

    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/* NOT FOUND ERROR */
export class NotFoundError extends ApiError {
  constructor(
    message = "The requested resource was not found.",
    apiErrorCode = "NOT_FOUND",
    description?: unknown,
  ) {
    super(message, 404, apiErrorCode, description);
    this.name = "NotFoundError";
  }
}

/* BAD REQUEST ERROR */
export class BadRequestError extends ApiError {
  constructor(
    message = "The request was invalid or cannot be served.",
    apiErrorCode = "BAD_REQUEST",
    description?: unknown,
  ) {
    super(message, 400, apiErrorCode, description);
    this.name = "BadRequestError";
  }
}

/* UNAUTHORIZED ERROR */
export class UnauthorizedError extends ApiError {
  constructor(
    message = "Unauthorized access to the requested resource.",
    apiErrorCode = "UNAUTHORIZED",
    description?: unknown,
  ) {
    super(message, 401, apiErrorCode, description);
    this.name = "UnauthorizedError";
  }
}

/* VALIDATION ERROR */
export class ValidationError extends ApiError {
  constructor(
    message = "The request data is invalid.",
    apiErrorCode = "VALIDATION_ERROR",
    description?: unknown,
  ) {
    super(message, 403, apiErrorCode, description);
    this.name = "ValidationError";
  }
}
