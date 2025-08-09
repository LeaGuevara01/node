const { PrismaClient } = require('@prisma/client');

// Single PrismaClient instance reused across the app to avoid connection spikes (important on Render)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

module.exports = prisma;
