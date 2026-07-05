import PrismaDB from "../../db/prisma";
import { TransactionCreateDTO, TransactionUpdateDTO } from "./dto/transactions.dto";

export default class TransactionsService {
  private db
  constructor(db: typeof PrismaDB) {
    this.db = db
  }

  public async create(data: TransactionCreateDTO) {
    const totalTransactionValue = data.items.reduce((sum, item) => sum + item.totalPrice, 0)
    
    return await this.db.transactions.create({
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
  }

  public async list(limit: number = 10, offset: number = 0) {
    return await this.db.transactions.findMany({
      take: limit,
      skip: offset
    })
  }

  public async find(id: number) {
    return await this.db.transactions.findUnique({
      where: {
        id: id
      }
    })
  }

  public async update(id: number, data: TransactionUpdateDTO) {
    await this.ensureNotDeleted(id)

    return await this.db.$transaction(async (tx) => {
      // 1. Deleta TODOS os itens vinculados a essa transação
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
  }

  public async delete(id: number) {
    await this.ensureNotDeleted(id)

    return await this.db.transactions.update({
      where: {
        id: id
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })
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
      throw new Error("Transação não encontrada."), null
    }
    if (status.isDeleted) {
      throw new Error("Transações deletadas não podem ser modificadas."), null
    }
  }
}
