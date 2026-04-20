require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { authenticate, requireAdmin } = require("./middleware/authenticate");

const app = express();
const PORT = process.env.PORT || 3000;

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";
const ORDER_URL   = process.env.ORDER_SERVICE_URL   || "http://localhost:3002";
const AUTH_URL    = process.env.AUTH_SERVICE_URL    || "http://localhost:3003";

// ─── Security ────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", credentials: true }));
app.use(morgan("dev"));

// ─── Rate Limiting ────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 200,
  message: { success: false, message: "Quá nhiều request. Thử lại sau 15 phút" },
  standardHeaders: true, legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,
  message: { success: false, message: "Quá nhiều lần thử đăng nhập. Thử lại sau 15 phút" },
});
app.use(globalLimiter);

// ─── Health Check ─────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway", uptime: Math.floor(process.uptime()), services: { product: PRODUCT_URL, order: ORDER_URL, auth: AUTH_URL } });
});

// ─── Proxy Helper ─────────────────────────────
const createProxy = (target, pathRewrite) => createProxyMiddleware({
  target,
  changeOrigin: true,
  ...(pathRewrite && { pathRewrite }),
  on: {
    error: (err, req, res) => {
      console.error("Proxy error:", err.message);
      res.status(503).json({ success: false, message: "Service tạm thời không khả dụng" });
    }
  }
});

// ─── Routes ──────────────────────────────────
// Auth: public (login/register không cần token)
app.use("/api/auth", authLimiter, createProxy(AUTH_URL));

// Products: GET public, POST/PUT/DELETE cần auth
app.get("/api/products*", createProxy(PRODUCT_URL));
app.get("/api/categories*", createProxy(PRODUCT_URL));
app.use("/api/products", authenticate, createProxy(PRODUCT_URL));
app.use("/api/categories", authenticate, requireAdmin, createProxy(PRODUCT_URL));

// Orders: cần auth
app.use("/api/orders", authenticate, createProxy(ORDER_URL));

// 404
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} không tồn tại` });
});

app.listen(PORT, () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);
  console.log(`   → Products: ${PRODUCT_URL}`);
  console.log(`   → Orders:   ${ORDER_URL}`);
  console.log(`   → Auth:     ${AUTH_URL}`);
});