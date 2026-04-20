require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Order Service running on port ${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => { console.error("❌ MongoDB connection failed:", err); process.exit(1); });

process.on("SIGTERM", () => mongoose.disconnect().then(() => process.exit(0)));