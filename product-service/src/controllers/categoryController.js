const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateSlug = (name) =>
  name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } });
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = generateSlug(name);
    const category = await prisma.category.create({ data: { name, slug, description } });
    res.status(201).json({ success: true, data: category, message: 'Tạo danh mục thành công' });
  } catch (error) { next(error); }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const category = await prisma.category.update({ where: { id }, data: { ...(name && { name, slug: generateSlug(name) }), ...(description !== undefined && { description }) } });
    res.json({ success: true, data: category });
  } catch (error) { next(error); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) return res.status(409).json({ success: false, message: `Không thể xoá: danh mục còn ${count} sản phẩm` });
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Xoá danh mục thành công' });
  } catch (error) { next(error); }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
