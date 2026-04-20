// src/app.js — Express app configuration
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Security & Utilities ────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*', credentials: true }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'product-service',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ─── Swagger UI ──────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { persistAuthorization: true },
  customSiteTitle: 'Product Service API',
  customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }'
}));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// ─── Routes ──────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// ─── 404 Handler ─────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} không tồn tại` });
});

// ─── Global Error Handler (LUÔN ĐỂ CUỐI) ───
app.use(errorHandler);

module.exports = app;
