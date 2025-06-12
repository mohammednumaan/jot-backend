import { z } from "zod";

const GetJotGroupRequestSchema = z.object({
  name: z.string(),
  jotGroupId: z.string(),
});

const GetJotGroupResponseSchema = z.object({
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

type GetJotGroupRequestType = z.infer<typeof GetJotGroupRequestSchema>;
type GetJotGroupResponseType = z.infer<typeof GetJotGroupResponseSchema>;

export {
  GetJotGroupRequestSchema,
  GetJotGroupRequestType,
  GetJotGroupResponseSchema,
  GetJotGroupResponseType,
};
