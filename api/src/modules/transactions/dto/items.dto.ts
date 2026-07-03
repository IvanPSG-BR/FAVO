import z from "zod";

const categoryEnum = z.enum([
  "HARVEST",
  "MINING",
  "FORAGE",
  "FISHING",
  "COMBAT"
])

const qualityEnum = z.enum([
  "NORMAL",
  "SILVER",
  "GOLD",
  "IRIDIUM"
])

const itemBaseSchema = z.object({
  id: z.int(),
  transactionId: z.int(),
  name: z.string(),
  quality: qualityEnum,
  quantity: z.int().min(1),
  totalPrice: z.int(),
  category: categoryEnum,
  createdAt: z.date(),
  updatedAt: z.date()
})

export const itemCreateSchema = itemBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export type itemBaseDTO = z.infer<typeof itemBaseSchema>
export type itemCreateDTO = z.infer<typeof itemCreateSchema>
