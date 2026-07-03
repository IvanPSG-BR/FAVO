import fp from 'fastify-plugin'
import swaggerui, { FastifySwaggerUiOptions } from '@fastify/swagger-ui'

export default fp<FastifySwaggerUiOptions>(async (fastify) => {
  fastify.register(swaggerui)
})
