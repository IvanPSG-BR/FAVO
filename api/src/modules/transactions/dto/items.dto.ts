import z from "zod";
import { CATEGORY, QUALITY } from "../../../generated/prisma/client.js";
import { items } from "../../../generated/prisma/client.js";

const categoryEnum = z.enum(CATEGORY)
const qualityEnum = z.enum(QUALITY)

const itemBaseSchema = z.object({
  id: z.int(),
  transactionsId: z.int(),
  name: z.string(),
  quality: qualityEnum,
  quantity: z.int().min(1),
  totalPrice: z.int().min(1),
  category: categoryEnum,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<items>

export const itemCreateSchema = itemBaseSchema.omit({
  id: true,
  transactionsId: true,
  createdAt: true,
  updatedAt: true
}) // "itemCreateSchema" apenas por não pensar em um nome mais descritivo

export type ItemBaseDTO = z.infer<typeof itemBaseSchema>
export type ItemCreateDTO = z.infer<typeof itemCreateSchema>
