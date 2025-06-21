import { z } from "zod";
import validateFileExtension from "../../utils/validate_file_extension.utils";

const CreateJotRequestSchema = z.object({
  jots: z.array(
    z
      .object({
        name: z.string().trim().min(1, "Filename is required"),
        content: z.string().trim().min(1, "File content is required"),
      })
      .refine(
        (data) => {
          const fileNameArr = data.name.split(".");
          return validateFileExtension(fileNameArr[fileNameArr.length - 1]);
        },
        {
          message:
            "Invalid file extension. Please provide a valid file extension",
          path: ["filename"],
        }
      )
  ),
  description: z.string().nullable(),
});

const GetAllJotsRequestSchema = z.object({
  page: z.coerce.number().int().nonnegative().default(1),
});

const GetAllJotsResponseSchema = z.object({
  jots: z.array(
    z.object({
      id: z.string(),
      name: z.string().nonempty(),
      extension: z.string().nonempty(),
      content: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),

      owner: z.object({
        id: z.string(),
        name: z.string().nonempty(),
      }),
      jotGroup: z.object({
        id: z.string(),
        totalFiles: z.number().int().nonnegative(),
        description: z.string().nullable(),
      }),
    })
  ),

  pagination: z.object({
    page: z.number().int().nonnegative(),
    size: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

const UpdateJotRequestSchema = z.object({
  jots: z.array(
    z
      .object({
        id: z.string(),
        name: z.string().trim().min(1, "Filename is required"),
        content: z.string().trim().min(1, "File content is required"),
      })
      .refine(
        (data) => {
          const fileNameArr = data.name.split(".");
          return validateFileExtension(fileNameArr[fileNameArr.length - 1]);
        },
        {
          message:
            "Invalid file extension. Please provide a valid file extension",
          path: ["filename"],
        }
      )
  ),
  description: z.string().nullable(),
});

type CreateJotRequestType = z.infer<typeof CreateJotRequestSchema>;
type GetAllJotsRequestType = z.infer<typeof GetAllJotsRequestSchema>;
type GetAllJotResponseType = z.infer<typeof GetAllJotsResponseSchema>;
type UpdateJotRequestType = z.infer<typeof UpdateJotRequestSchema>;

export {
  CreateJotRequestSchema,
  CreateJotRequestType,
  GetAllJotsResponseSchema,
  GetAllJotResponseType,
  GetAllJotsRequestSchema,
  GetAllJotsRequestType,
  UpdateJotRequestSchema,
  UpdateJotRequestType
};
