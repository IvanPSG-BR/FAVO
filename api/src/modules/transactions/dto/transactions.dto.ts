import z from "zod";
import { itemCreateSchema } from "./items.dto";

const seasonEnum = z.enum([
  "SPRING",
  "SUMMER",
  "AUTUMN",
  "WINTER"
])

const transactionTypeEnum = z.enum([
  "INCOME",
  "EXPENSE"
])

const transactionBaseSchema = z.object({
  id: z.int(),
  title: z.string(),
  totalValue: z.int().min(1),
  day: z.int().min(1).max(28),
  season: seasonEnum,
  items: z.array(itemCreateSchema),
  type: transactionTypeEnum,
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

const transactionReadSchema = transactionBaseSchema.omit({ id: true })

const transactionCreateSchema = transactionBaseSchema.omit({
  id: true,
  totalValue: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
})

const transactionUpdateSchema = transactionCreateSchema.partial()

export type TransactionBaseDTO = z.infer<typeof transactionBaseSchema>
export type TransactionReadDTO = z.infer<typeof transactionReadSchema>
export type TransactionCreateDTO = z.infer<typeof transactionCreateSchema>
export type TransactionUpdateDTO = z.infer<typeof transactionUpdateSchema>
