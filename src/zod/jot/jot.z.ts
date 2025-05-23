import { z } from "zod";
import validateFileExtension from "../../utils/validate_file_extension.utils";

const JotRequestSchema = z
  .object({
    name: z.string().trim().min(1, "Filename is required"),
    content: z.string().trim().min(1, "File content is required"),
    description: z.string().trim().nullable(),
  })
  .refine(
    (data) => {
      console.log(data)
      const fileNameArr = data.name.split(".");
      return validateFileExtension(fileNameArr[fileNameArr.length - 1]);
    },
    {
      message: "Invalid file extension. Please provide a valid file extension",
      path: ["filename"],
    }
  );

const JotResponseSchema = z.object({
  jot: z.object({
    name: z.string().nonempty(),
    extension: z.string().nonempty(),
    description: z.string().nullable(),
    content: z.string(),
    createdAt: z.date(),
  }),
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
});

type JotRequestType = z.infer<typeof JotRequestSchema>;
type JotResponseType = z.infer<typeof JotResponseSchema>;
type AllJotsType = z.infer<typeof allJotsResponseSchema>;

export {
  JotRequestSchema,
  JotRequestType,
  JotResponseSchema,
  JotResponseType,
  allJotsResponseSchema,
  AllJotsType,
};
