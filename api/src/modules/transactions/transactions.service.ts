import PrismaDB from "../../db/prisma.js";
import { TransactionCreateDTO, TransactionUpdateDTO } from "./dto/transactions.dto.js";
import ITransactionsService from "./transactions.service.interface.js";

export default class TransactionsService implements ITransactionsService {
  private readonly db
  constructor(db: typeof PrismaDB) {
    this.db = db
  }

  public async create(data: TransactionCreateDTO) {
    const totalTransactionValue = data.items.reduce((sum, item) => sum + item.totalPrice, 0) // Estudar sobre posteriormente essa linha, pois não compreendo ela totalmente ainda
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

    if (!query) { throw new Error("Transação não pôde ser criada.") }
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

    if (!query) { throw new Error("Transações não Encontradas") }
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

    if (!query) { throw new Error("Transação não Encontrada") }
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

    if (!query) { throw new Error("Transação não pôde ser atualizada") }
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

    if (!query) { throw new Error("Transação não pôde ser deletada") }
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
      throw new Error("Transação não encontrada.")
    }
    if (status.isDeleted) {
      throw new Error("Transações deletadas não podem ser modificadas.")
    }

    return
  }
}
