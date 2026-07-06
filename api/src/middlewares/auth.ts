import { FastifyRequest, FastifyReply } from 'fastify'

export default async function authMiddleware(req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply | void> {
  const adminSecret = req.headers["x-api-key"]

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
    return rep.code(401).send({ details: "Unauthorized" })
  }
  return
}
