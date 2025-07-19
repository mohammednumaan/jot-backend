import { Prisma } from "../../../generated/prisma";
import { envData } from "../../env";
import { ValidationError } from "../api/error";

export async function prismaErrorHandler<QueryReturnType>(
  queryFn: () => Promise<QueryReturnType>
): Promise<QueryReturnType> {
  try {
    const queryResult: QueryReturnType = await queryFn();
    return queryResult;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new ValidationError(
        "Database validation failed. Invalid query structure."
      );
    }

    if (envData.NODE_ENV === "development") {
      throw new Error(error as string);
    } else {
      throw new Error("Something went wrong!");
    }
  }
}
