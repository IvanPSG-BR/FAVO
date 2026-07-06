import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import env from '@fastify/env'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  const envSchema = {
    type: "object",
    required: ["ADMIN_SECRET_KEY", "DATABASE_URL"],
    properties: {
      ADMIN_SECRET_KEY: { type: "string" },
      DATABASE_URL: { type: "string" }
    }
  }
  await fastify.register(env, { schema: envSchema, dotenv: true })
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(import.meta.dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(import.meta.dirname, 'routes'),
    options: opts
  })
}

export default app
export { app, options }
