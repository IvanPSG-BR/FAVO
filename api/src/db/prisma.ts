import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const dbUrl = process.env.DATABASE_URL

const pool = new Pool({ connectionString: dbUrl })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter: adapter })

export default db
