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
    }),
  ),
});

const GetAllJotGroupsByUserIdRequestSchema = z.object({
  page: z.coerce.number().int().positive(),
  name: z.string().trim().nonempty(),
});

const GetAllJotGroupsByUserIdResponseSchema = z.object({
  jots: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      totalFiles: z.number().int().positive(),
    }),
  ),
  pagination: z.object({
    page: z.number().int().nonnegative(),
    size: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

type GetJotGroupRequestType = z.infer<typeof GetJotGroupRequestSchema>;
type GetJotGroupResponseType = z.infer<typeof GetJotGroupResponseSchema>;
type GetAllJotGroupsByUserIdRequestType = z.infer<
  typeof GetAllJotGroupsByUserIdRequestSchema
>;
type GetAllJotGroupsByUserIdResponseType = z.infer<
  typeof GetAllJotGroupsByUserIdResponseSchema
>;

export {
  GetJotGroupRequestSchema,
  GetJotGroupRequestType,
  GetJotGroupResponseSchema,
  GetJotGroupResponseType,
  GetAllJotGroupsByUserIdRequestSchema,
  GetAllJotGroupsByUserIdRequestType,
  GetAllJotGroupsByUserIdResponseSchema,
  GetAllJotGroupsByUserIdResponseType,
};
