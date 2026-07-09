import PrismaDB from "../../db/prisma.js";
import AppError from "../../errors/app-logic.error.js";
import { TransactionCreateDTO, TransactionUpdateDTO } from "./dto/transactions.dto.js";
import ITransactionsService from "./transactions.service.interface.js";
import { ERROR_TAGS } from "../../errors/dto/default-error.interface.js";

export default class TransactionsService implements ITransactionsService {
  private readonly db
  private readonly prismaUnknownError
  private readonly prismaNotFoundError
  constructor(db: typeof PrismaDB) {
    this.db = db
    this.prismaUnknownError = new AppError(500, {
      name: "internalServerError",
      type: ERROR_TAGS.DATABASE,
      message: "Não foi possível realizar a operação. Conferir logs da API para mais detalhes.",
      identifierCode: "UNKNOWN_ERROR"
    })
    this.prismaNotFoundError = new AppError(404, {
      name: "notFound",
      type: ERROR_TAGS.DATABASE,
      message: "Transação não encontrada. O Client enviou o id corretamente? Conferir logs da API para mais detalhes.",
      identifierCode: "TRANSACTION_NOT_FOUND"
    })
  }

  public async create(data: TransactionCreateDTO) {
    const totalTransactionValue = data.items.reduce((sum, item) => {
      return sum + item.totalPrice
    }, 0)
    const query = await this.db.transactions.create({
      data: {
        title: data.title,
        totalValue: totalTransactionValue,
        day: data.day,
        season: data.season,
        items: {
          create: data.items
        },
        type: data.type,
        isDeleted: data.isDeleted
      },
      include: {
        items: true
      }
    })

    return query
  }

  public async list(limit: number = 10, offset: number = 0) {
    const query = await this.db.transactions.findMany({
      take: limit,
      skip: offset,
      include: {
        items: true
      }
    })

    return query
  }

  public async find(id: number) {
    const query = await this.db.transactions.findUnique({
      where: {
        id: id
      },
      include: {
        items: true
      }
    })

    if (!query) {
      throw this.prismaNotFoundError
    }
    return query
  }

  public async update(id: number, data: TransactionUpdateDTO) {
    await this.ensureNotDeleted(id)
    const query = await this.db.$transaction(async (tx) => {
      await tx.items.deleteMany({
        where: { transactionsId: id }
      })

      return await this.db.transactions.update({
        where: {
          id: id
        },
        data: {
          title: data.title,
          day: data.day,
          season: data.season,
          items: {
            create: data.items
          },
          type: data.type,
          isDeleted: data.isDeleted
        },
        include: {
          items: true
        }
      })
    })

    if (!query) { 
      throw this.prismaNotFoundError
    }
    return query
  }

  public async delete(id: number) {
    await this.ensureNotDeleted(id)
    const query = await this.db.transactions.update({
      where: {
        id: id
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    if (!query) { throw this.prismaNotFoundError }
    return query.isDeleted
  }

  private async ensureNotDeleted(id: number) {
    const status = await this.db.transactions.findUnique({
      where: {
        id: id
      },
      select: {
        isDeleted: true
      }
    })

    if (!status) {
      throw this.prismaNotFoundError
    }
    if (status.isDeleted) {
      throw new AppError(400, {
        name: "badRequest",
        type: ERROR_TAGS.APP,
        message: "Transações alteradas não podem ser modificadas.",
        identifierCode: "MODIFY_RECORD_NOT_ALLOWED"
      })
    }
    return
  }
}
