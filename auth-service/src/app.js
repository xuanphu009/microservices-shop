const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "auth-service", uptime: Math.floor(process.uptime()) }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "Auth Service API" }));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("*", (req, res) => res.status(404).json({ success: false, message: "Route không tồn tại" }));
app.use(errorHandler);

module.exports = app;