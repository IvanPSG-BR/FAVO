import fp from 'fastify-plugin'
import helmet, { FastifyHelmetOptions } from '@fastify/helmet'

export default fp<FastifyHelmetOptions>(async (fastify) => {
  fastify.register(helmet, { contentSecurityPolicy: false /* Evita bloqueio do swaggerui */})
})
