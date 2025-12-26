"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set. Please create a .env file with your database connection string.");
}
// Create PostgreSQL pool
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
// Create PrismaClient with adapter - Prisma 7.x with custom output requires adapter
const prisma = new client_1.PrismaClient({
    adapter,
});
exports.default = prisma;
