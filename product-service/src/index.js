// src/index.js — Entry point
require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected');

    app.listen(PORT, () => {
      console.log(`🚀 Product Service running on port ${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  }
}

bootstrap();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
