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
      content: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  description: z.string().nullable()
});

const GetAllJotGroupsByUserIdRequestSchema = z.object({
  page: z.coerce.number().int().positive(),
  name: z.string().trim().nonempty(),
});

type GetJotGroupRequestType = z.infer<typeof GetJotGroupRequestSchema>;
type GetJotGroupResponseType = z.infer<typeof GetJotGroupResponseSchema>;
type GetAllJotGroupsByUserIdRequestType = z.infer<
  typeof GetAllJotGroupsByUserIdRequestSchema
>;

export {
  GetJotGroupRequestSchema,
  GetJotGroupRequestType,
  GetJotGroupResponseSchema,
  GetJotGroupResponseType,
  GetAllJotGroupsByUserIdRequestSchema,
  GetAllJotGroupsByUserIdRequestType,
};
