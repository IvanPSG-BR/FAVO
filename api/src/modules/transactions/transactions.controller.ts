import { SEASON } from "../../generated/prisma/enums.js";
import { ORDER } from "./dto/transactions-filters.dto.js";
import { TransactionBaseDTO, TransactionCreateDTO } from "./dto/transactions.dto.js";
import ITransactionsService from "./transactions.service.interface.js";
import { FastifyRequest, FastifyReply } from "fastify";

export default class TransactionsController {
  private transactionsService
  constructor(transactionsService: ITransactionsService) {
    this.transactionsService = transactionsService
  }

  public create = async (req: FastifyRequest<{ Body: TransactionCreateDTO }>, rep: FastifyReply): Promise<FastifyReply> => {
    const transactionCreated = await this.transactionsService.create(req.body)
    return rep.status(201).send(transactionCreated)
  }

  public list = async (req: FastifyRequest<{
    Querystring: {
      limit: number,
      offset: number,
      season?: SEASON,
      valueStart?: number,
      valueEnd?: number,
      dayStart?: number,
      dayEnd?: number,
      deleted?: boolean,
      orderedByTotalValue?: ORDER
      orderedByDay?: ORDER
      orderedByCreatedAt?: ORDER
      orderedByUpdatedAt?: ORDER
    }
  }>, rep: FastifyReply): Promise<FastifyReply> => {
    const transactionList = await this.transactionsService.list(req.query.limit, req.query.offset, {
      season: req.query.season ?? "ALL",
      valueRange: [Number(req.query.valueStart) ?? 1, Number(req.query.valueEnd) ?? 999999999],
      dayRange: [Number(req.query.dayStart) ?? 1, Number(req.query.dayEnd) ?? 28],
      deleted: Boolean(req.query.deleted) ?? false,
      orderedBy: {
        totalValue: req.query.orderedByTotalValue ?? ORDER.ASC,
        day: req.query.orderedByDay ?? ORDER.ASC,
        createdAt: req.query.orderedByCreatedAt ?? ORDER.ASC,
        updatedAt: req.query.orderedByCreatedAt ?? ORDER.ASC
      }
    })
    return rep.status(200).send(transactionList)
  }

  public find = async (req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply): Promise<FastifyReply> => {
    const transaction = await this.transactionsService.find(Number(req.params.id))
    return rep.status(200).send(transaction)
  }

  public update = async (req: FastifyRequest<{ Params: { id: number }, Body: TransactionBaseDTO }>, rep: FastifyReply): Promise<FastifyReply> => {
    const transaction = await this.transactionsService.update(Number(req.params.id), req.body)
    return rep.status(200).send(transaction)
  }

  public delete = async (req: FastifyRequest<{ Params: { id: number } }>, rep: FastifyReply): Promise<FastifyReply> => {
    const transaction = await this.transactionsService.delete(Number(req.params.id))
    return rep.status(200).send({ isDeleted: transaction })
  }
}
