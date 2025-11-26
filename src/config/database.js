// Prisma Client configuration for Prisma 7
require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;

// Create Prisma adapter with connection string
const adapter = new PrismaPg({ connectionString });

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
