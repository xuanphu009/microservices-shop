require("dotenv").config();
const app = require("./app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3003;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL (Auth) connected");
    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running on port ${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) { console.error("❌ Startup failed:", err); process.exit(1); }
}
bootstrap();
process.on("SIGTERM", async () => { await prisma.$disconnect(); process.exit(0); });