const router = require("express").Router();
const { createOrder, getOrdersByCustomer, getOrderById, updateOrderStatus, getAllOrders } = require("../controllers/orderController");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Quản lý đơn hàng
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, customerName, customerEmail, items, shippingAddress]
 *             properties:
 *               customerId: { type: integer, example: 1 }
 *               customerName: { type: string, example: "Nguyễn Văn A" }
 *               customerEmail: { type: string, example: "user@example.com" }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: integer }
 *                     productName: { type: string }
 *                     price: { type: number }
 *                     quantity: { type: integer }
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   district: { type: string }
 *                   city: { type: string }
 *               note: { type: string }
 *     responses:
 *       201:
 *         description: Đặt hàng thành công
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy tất cả đơn hàng (admin)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipping, delivered, cancelled]
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/", getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy
 */
router.get("/:id", getOrderById);

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Lấy đơn hàng theo khách hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/customer/:customerId", getOrdersByCustomer);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipping, delivered, cancelled]
 *               cancelReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       409:
 *         description: Không thể thay đổi trạng thái
 */
router.put("/:id/status", updateOrderStatus);

module.exports = router;