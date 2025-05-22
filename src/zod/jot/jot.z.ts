import { z } from "zod";
import validateFileExtension from "../../utils/validate_file_extension.utils";

const JotRequestSchema = z.object({
  filename: z.string().trim().min(1, "Filename is required"),
  fileContent: z.string().trim().min(1, "File content is required"),
  description: z.string().trim().nullable()
}).refine((data) => {
  const fileNameArr = data.filename.split(".");
  return validateFileExtension(fileNameArr[fileNameArr.length - 1]);
}, {
  message: "Invalid file extension. Please provide a valid file extension",
  path: ['filename']
});

type JotRequestType = z.infer<typeof JotRequestSchema>
export {
    JotRequestType,
    JotRequestSchema ,
}
