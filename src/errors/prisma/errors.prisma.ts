import { Prisma } from "../../../generated/prisma";
import { ValidationError } from "../api/error";

export async function prismaErrorHandler<QueryReturnType>(
  queryFn: () => Promise<QueryReturnType>
): Promise<QueryReturnType> {
  try {
    const queryResult: QueryReturnType = await queryFn();
    return queryResult;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new ValidationError("Database validation failed. Invalid query structure.")
    }
    throw new Error("Something went wrong!");
  }
}
