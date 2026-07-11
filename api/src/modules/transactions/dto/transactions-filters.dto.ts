import z from "zod";
import { SEASON } from "../../../generated/prisma/enums.js";

export enum ORDER {
  ASC = "asc",
  DESC = "desc"
}

const transactionOrderSchema = z.object({
  totalValue: z.enum(ORDER).default(ORDER.ASC),
  day: z.enum(ORDER).default(ORDER.ASC),
  createdAt: z.enum(ORDER).default(ORDER.ASC),
  updatedAt: z.enum(ORDER).default(ORDER.ASC)
})

const transactionFiltersSchema = z.object({
  season: z.enum(SEASON),
  valueRange: z.tuple([z.int(), z.int()]).default([1, 999999999]),
  dayRange: z.tuple([z.int(), z.int()]).default([1, 28]),
  deleted: z.boolean().default(false),
  orderedBy: transactionOrderSchema
})

type TransactionFiltersDTO = z.infer<typeof transactionFiltersSchema>
export default TransactionFiltersDTO
