import z from "zod";
import { itemCreateSchema } from "./items.dto.js";
import { SEASON, TRANSACTION_TYPE } from "../../../generated/prisma/client.js";
import { transactions } from "../../../generated/prisma/client.js";

const seasonEnum = z.enum(SEASON)
const transactionTypeEnum = z.enum(TRANSACTION_TYPE)

const transactionBaseSchema = z.object({
  id: z.int(),
  title: z.string(),
  totalValue: z.int().min(1),
  day: z.int().min(1).max(28),
  season: seasonEnum,
  type: transactionTypeEnum,
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
}).extend({ items: z.array(itemCreateSchema) }) satisfies z.ZodType<transactions>

const transactionCreateSchema = transactionBaseSchema.omit({
  id: true,
  totalValue: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
}).strict()

const transactionUpdateSchema = transactionCreateSchema.partial()

export type TransactionBaseDTO = z.infer<typeof transactionBaseSchema>
export type TransactionCreateDTO = z.infer<typeof transactionCreateSchema>
export type TransactionUpdateDTO = z.infer<typeof transactionUpdateSchema>
