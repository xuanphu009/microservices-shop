// prisma/seed.js — Dữ liệu mẫu cho Product Service
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // ─── Categories ──────────────────────────
  const mobile = await prisma.category.upsert({
    where: { slug: 'mobile' },
    update: {},
    create: { name: 'Điện thoại', slug: 'mobile', description: 'Smartphone & Mobile' }
  });

  const laptop = await prisma.category.upsert({
    where: { slug: 'laptop' },
    update: {},
    create: { name: 'Laptop', slug: 'laptop', description: 'Máy tính xách tay' }
  });

  const tablet = await prisma.category.upsert({
    where: { slug: 'tablet' },
    update: {},
    create: { name: 'Tablet', slug: 'tablet', description: 'Máy tính bảng' }
  });

  console.log('✅ Categories created:', { mobile: mobile.id, laptop: laptop.id, tablet: tablet.id });

  // ─── Products ────────────────────────────
  await prisma.product.createMany({
    data: [
      // Điện thoại
      { name: 'iPhone 15 Pro', slug: 'iphone-15-pro', price: 27990000, stock: 50, categoryId: mobile.id, description: 'Chip A17 Pro, camera 48MP, titanium' },
      { name: 'iPhone 15', slug: 'iphone-15', price: 22990000, stock: 80, categoryId: mobile.id, description: 'Dynamic Island, USB-C' },
      { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-s24-ultra', price: 31990000, stock: 30, categoryId: mobile.id, description: 'AI Phone, S-Pen, 200MP' },
      { name: 'Samsung Galaxy S24', slug: 'samsung-s24', price: 22990000, stock: 45, categoryId: mobile.id, description: 'Snapdragon 8 Gen 3' },
      { name: 'Xiaomi 14 Pro', slug: 'xiaomi-14-pro', price: 19990000, stock: 60, categoryId: mobile.id, description: 'Leica camera, Snapdragon 8 Gen 3' },
      // Laptop
      { name: 'MacBook Pro 14 M3', slug: 'macbook-pro-14-m3', price: 52990000, stock: 20, categoryId: laptop.id, description: 'Apple M3 Pro, 18GB RAM, 512GB SSD' },
      { name: 'MacBook Air M2', slug: 'macbook-air-m2', price: 29990000, stock: 35, categoryId: laptop.id, description: 'Apple M2, 8GB RAM, 256GB SSD' },
      { name: 'Dell XPS 15', slug: 'dell-xps-15', price: 45990000, stock: 15, categoryId: laptop.id, description: 'Intel i9, RTX 4070, 32GB RAM' },
      { name: 'ASUS ROG Zephyrus G14', slug: 'asus-rog-g14', price: 38990000, stock: 25, categoryId: laptop.id, description: 'Ryzen 9, RTX 4060, 144Hz' },
      // Tablet
      { name: 'iPad Pro 12.9 M2', slug: 'ipad-pro-12-m2', price: 32990000, stock: 40, categoryId: tablet.id, description: 'M2 chip, Liquid Retina XDR' },
      { name: 'Samsung Galaxy Tab S9', slug: 'samsung-tab-s9', price: 21990000, stock: 30, categoryId: tablet.id, description: 'AMOLED, S Pen included' },
    ],
    skipDuplicates: true
  });

  const productCount = await prisma.product.count();
  console.log(`✅ Products seeded: ${productCount} records`);
  console.log('🎉 Seed hoàn thành!');
}

main()
  .catch((e) => { console.error('❌ Seed lỗi:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
