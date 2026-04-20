// src/routes/productRoutes.js
const router = require('express').Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { productValidation } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý sản phẩm
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Số trang (bắt đầu từ 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Số bản ghi mỗi trang (tối đa 100)
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Tìm kiếm theo tên sản phẩm
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Lọc theo slug danh mục (vd: mobile, laptop)
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *         description: Giá tối đa
 *       - in: query
 *         name: inStock
 *         schema: { type: boolean }
 *         description: Chỉ lấy sản phẩm còn hàng
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [name, price, createdAt, stock], default: createdAt }
 *         description: Trường sắp xếp
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "iPhone 15 Pro Max"
 *             price: 34990000
 *             stock: 30
 *             categoryId: 1
 *             description: "Chip A17 Pro, 256GB"
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       422:
 *         description: Dữ liệu không hợp lệ
 *       409:
 *         description: Sản phẩm đã tồn tại
 */
router.post('/', productValidation, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put('/:id', updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Ẩn sản phẩm (soft delete)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Đã ẩn sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.delete('/:id', deleteProduct);

module.exports = router;
