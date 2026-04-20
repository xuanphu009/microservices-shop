const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateSlug = (name) =>
  name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');

const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category, sortBy = 'createdAt', order = 'desc', minPrice, maxPrice, inStock } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const allowedSortFields = ['name', 'price', 'createdAt', 'stock'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const safeOrder = ['asc', 'desc'].includes(order) ? order : 'desc';
    const where = {
      isActive: true,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(category && { category: { slug: category } }),
      ...((minPrice || maxPrice) && { price: { ...(minPrice && { gte: parseFloat(minPrice) }), ...(maxPrice && { lte: parseFloat(maxPrice) }) } }),
      ...(inStock === 'true' && { stock: { gt: 0 } }),
    };
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, include: { category: { select: { id: true, name: true, slug: true } } }, orderBy: { [safeSortBy]: safeOrder }, skip, take: limitNum }),
      prisma.product.count({ where }),
    ]);
    res.json({ success: true, data: products, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum), hasNext: pageNum < Math.ceil(total / limitNum), hasPrev: pageNum > 1 } });
  } catch (error) { next(error); }
};

const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock = 0, imageUrl, categoryId } = req.body;
    const slug = generateSlug(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) return res.status(409).json({ success: false, message: 'Sản phẩm với tên này đã tồn tại' });
    const product = await prisma.product.create({
      data: { name, slug, price: parseFloat(price), description, stock: parseInt(stock), imageUrl, ...(categoryId && { categoryId: parseInt(categoryId) }) },
      include: { category: true }
    });
    res.status(201).json({ success: true, data: product, message: 'Tạo sản phẩm thành công' });
  } catch (error) { next(error); }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    const { name, price, description, stock, imageUrl, categoryId, isActive } = req.body;
    const updateData = {
      ...(name && { name, slug: generateSlug(name) }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(description !== undefined && { description }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
    };
    const product = await prisma.product.update({ where: { id }, data: updateData, include: { category: true } });
    res.json({ success: true, data: product, message: 'Cập nhật thành công' });
  } catch (error) { next(error); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    res.json({ success: true, message: 'Đã ẩn sản phẩm thành công (soft delete)' });
  } catch (error) { next(error); }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
