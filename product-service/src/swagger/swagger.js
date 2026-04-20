// src/swagger/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'RESTful API quản lý sản phẩm — Microservices Lab 2',
      contact: { name: 'Dev Team', email: 'dev@example.com' },
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Development' },
      { url: 'https://product-service.railway.app', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'iPhone 15 Pro' },
            slug: { type: 'string', example: 'iphone-15-pro' },
            description: { type: 'string', example: 'Chip A17 Pro, camera 48MP' },
            price: { type: 'number', example: 27990000 },
            stock: { type: 'integer', example: 50 },
            imageUrl: { type: 'string', example: 'https://example.com/img.jpg' },
            isActive: { type: 'boolean', example: true },
            category: { '$ref': '#/components/schemas/Category' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Điện thoại' },
            slug: { type: 'string', example: 'mobile' },
            description: { type: 'string', example: 'Smartphone & Mobile' },
          }
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: { type: 'string', example: 'iPhone 15 Pro' },
            price: { type: 'number', example: 27990000 },
            description: { type: 'string', example: 'Mô tả sản phẩm' },
            stock: { type: 'integer', example: 50 },
            imageUrl: { type: 'string', example: 'https://...' },
            categoryId: { type: 'integer', example: 1 },
          }
        },
        PaginatedProducts: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { '$ref': '#/components/schemas/Product' } },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer', example: 50 },
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                totalPages: { type: 'integer', example: 5 },
                hasNext: { type: 'boolean', example: true },
                hasPrev: { type: 'boolean', example: false },
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mô tả lỗi' },
            code: { type: 'string', example: 'NOT_FOUND' },
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
