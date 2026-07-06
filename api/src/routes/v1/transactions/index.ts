import { FastifyPluginAsync } from 'fastify'
import authMiddleware from '../../../middlewares/auth.js'
import TransactionsService from '../../../modules/transactions/transactions.service.js'
import TransactionsController from '../../../modules/transactions/transactions.controller.js'
import db from '../../../db/prisma.js'
import { TransactionBaseDTO, TransactionCreateDTO } from '../../../modules/transactions/dto/transactions.dto.js'

const transactions: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const transactionsService = new TransactionsService(db)
  const transactionsController = new TransactionsController(transactionsService)
  
  fastify.get<{ Querystring: { limit: number, offset: number } }>(
    '/',
    { preHandler: authMiddleware },
    transactionsController.list
  )
  
  fastify.get<{ Params: { id: number } }>(
    '/:id',
    { preHandler: authMiddleware },
    transactionsController.find
  )

  fastify.post<{ Body: TransactionCreateDTO }>(
    '/',
    { preHandler: authMiddleware },
    transactionsController.create
  )

  fastify.put<{ Params: { id: number }, Body: TransactionBaseDTO }>(
    '/:id',
    { preHandler: authMiddleware },
    transactionsController.update
  )

  fastify.delete<{ Params: { id: number } }>(
    '/:id',
    { preHandler: authMiddleware },
    transactionsController.delete
  )
}

export default transactions
