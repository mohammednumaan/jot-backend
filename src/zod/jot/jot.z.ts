import { z } from "zod";
import validateFileExtension from "../../utils/validate_file_extension.utils";

const JotRequestSchema = z.object({
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

const JotResponseSchema = z.object({
  jot: z.object({
    name: z.string().nonempty(),
    extension: z.string().nonempty(),
    description: z.string().nullable(),
    content: z.string(),
    createdAt: z.date(),
  }),
});

const allJotsRequestSchema = z.object({
  page: z.coerce.number().int().nonnegative().default(1),
});

const allJotsResponseSchema = z.object({
  jots: z.array(
    z.object({
      id: z.string(),
      name: z.string().nonempty(),
      extension: z.string().nonempty(),
      description: z.string().nullable(),
      content: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),

  pagination: z.object({
    page: z.number().int().nonnegative(),
    size: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

type JotRequestType = z.infer<typeof JotRequestSchema>;
type JotResponseType = z.infer<typeof JotResponseSchema>;
type AllJotsType = z.infer<typeof allJotsResponseSchema>;
type AllJotsRequestType = z.infer<typeof allJotsRequestSchema>;

export {
  JotRequestSchema,
  JotRequestType,
  JotResponseSchema,
  JotResponseType,
  allJotsResponseSchema,
  AllJotsType,
  allJotsRequestSchema,
  AllJotsRequestType,
};
