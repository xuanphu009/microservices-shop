const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => res.json({ status: "ok", service: "order-service", uptime: Math.floor(process.uptime()) }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "Order Service API" }));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
app.use("/api/orders", orderRoutes);
app.use("*", (req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} không tồn tại` }));
app.use(errorHandler);

module.exports = app;