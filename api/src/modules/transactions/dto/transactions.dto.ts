import z from "zod";
import { itemCreateSchema } from "./items.dto";

const seasonEnum = z.enum([
  "SPRING",
  "SUMMER",
  "AUTUMN",
  "WINTER"
])

const transactionBaseSchema = z.object({
  id: z.int(),
  title: z.string(),
  totalValue: z.int(),
  day: z.int().min(1).max(28),
  season: seasonEnum,
  items: itemCreateSchema,
  createdAt: z.date(),
  updatedAt: z.date()
})

const transactionCreateSchema = transactionBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

const transactionUpdateSchema = transactionCreateSchema.partial()

export type transactionBaseDTO = z.infer<typeof transactionBaseSchema>
export type transactionCreateDTO = z.infer<typeof transactionCreateSchema>
export type transactionUpdateDTO = z.infer<typeof transactionUpdateSchema>
