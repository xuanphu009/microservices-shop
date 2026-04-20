const router = require("express").Router();
const { register, login, refreshToken, getMe, logout } = require("../controllers/authController");
const { authenticate } = require("../middleware/authenticate");
const { registerValidation, loginValidation } = require("../middleware/validate");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Xác thực và phân quyền
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string, format: email, example: "user@example.com" }
 *               password: { type: string, minLength: 6, example: "password123" }
 *               name: { type: string, example: "Nguyễn Văn A" }
 *     responses:
 *       201:
 *         description: Đăng ký thành công, trả về tokens
 *       409:
 *         description: Email đã tồn tại
 */
router.post("/register", registerValidation, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
router.post("/login", loginValidation, login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Làm mới access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Trả về access token mới
 *       401:
 *         description: refreshToken không hợp lệ
 */
router.post("/refresh", refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *       401:
 *         description: Chưa xác thực
 */
router.get("/me", authenticate, getMe);
router.post("/logout", logout);

module.exports = router;