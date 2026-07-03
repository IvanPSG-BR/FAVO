import fp from 'fastify-plugin'
import swagger, { FastifySwaggerOptions } from '@fastify/swagger'

export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.register(swagger, {
    openapi: {
      info: {
        title: "FACO",
        description: "Sistema FinTech & AgroTech com tema Stardew Valley",
        version: "1.0.0"
      },
      servers: [
        { url: "http://localhost:3000" }
      ]
    }
  })
})
