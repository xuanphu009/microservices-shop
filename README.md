# 🛍️ Microservices Shop — Lab 2

Hệ thống backend microservices với Node.js, PostgreSQL, MongoDB, Docker.

## 🏗️ Kiến trúc

```
Client → API Gateway (3000)
           ├── Product Service (3001) ← PostgreSQL
           ├── Order Service   (3002) ← MongoDB
           └── Auth Service    (3003) ← PostgreSQL
```

## 🚀 Khởi động nhanh

### Cách 1: Docker Compose (Khuyến nghị)

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/microservices-shop.git
cd microservices-shop

# Chạy toàn bộ hệ thống
docker-compose up -d

# Xem logs
docker-compose logs -f

# Seed dữ liệu mẫu
docker-compose exec product-service npx prisma db seed
```

### Cách 2: Chạy từng service riêng

```bash
# Terminal 1 - Product Service
cd product-service
cp .env.example .env        # Điền DATABASE_URL
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# Terminal 2 - Order Service
cd order-service
cp .env.example .env        # Điền MONGODB_URI
npm install
npm run dev

# Terminal 3 - Auth Service
cd auth-service
cp .env.example .env        # Điền AUTH_DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run dev

# Terminal 4 - API Gateway
cd api-gateway
cp .env.example .env
npm install
npm run dev
```

## 📚 API Documentation (Swagger)

| Service         | URL                              |
|----------------|----------------------------------|
| Product Service | http://localhost:3001/api-docs  |
| Order Service   | http://localhost:3002/api-docs  |
| Auth Service    | http://localhost:3003/api-docs  |

## 🧪 Test

Import file `postman/Lab2.postman_collection.json` vào Postman.

## 📦 Deploy lên Railway

```bash
# Cài Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy product-service
cd product-service
railway init
railway up

# Thêm biến môi trường trong Railway Dashboard:
# DATABASE_URL = (từ Supabase)
# NODE_ENV = production

# Chạy migration
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

## 🗂️ Cấu trúc thư mục

```
microservices-shop/
├── api-gateway/          # Entry point, proxy + auth middleware
├── product-service/      # Express + Prisma + PostgreSQL
│   ├── prisma/           # Schema, migrations, seed
│   └── src/
│       ├── controllers/
│       ├── routes/       # + Swagger JSDoc annotations
│       ├── middleware/   # validate, errorHandler
│       └── swagger/
├── order-service/        # Express + Mongoose + MongoDB
├── auth-service/         # Express + JWT + bcrypt + Prisma
├── docker-compose.yml
├── postman/              # Test collection
└── scripts/              # DB init scripts
```

## ✅ Checklist

- [x] Product Service - CRUD + Pagination + Filter + Swagger
- [x] Order Service - Create/Read/Update status
- [x] Auth Service - Register/Login/Refresh/Me
- [x] API Gateway - Proxy + Rate limiting + JWT middleware
- [x] Docker Compose - Full system orchestration
- [x] Postman Collection
