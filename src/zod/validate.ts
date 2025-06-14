import { ZodError, ZodSchema } from "zod";

interface ISuccessValidation<T> {
  success: true;
  data: T;
}

interface IErrorValidation {
  success: false;
  error: ZodError;
}

export default function validate<T>(
  schema: ZodSchema,
  inputs: T,
): ISuccessValidation<T> | IErrorValidation {
  const result = schema.safeParse(inputs);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      error: result.error,
    };
  }
}
