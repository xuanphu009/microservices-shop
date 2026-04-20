const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
  return { accessToken, refreshToken };
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: "Email đã được sử dụng" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    const { accessToken, refreshToken } = generateTokens({ userId: user.id, email: user.email, role: user.role });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
    res.status(201).json({ success: true, data: { user, accessToken, refreshToken }, message: "Đăng ký thành công" });
  } catch (error) { next(error); }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    const { accessToken, refreshToken } = generateTokens({ userId: user.id, email: user.email, role: user.role });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: { user: userWithoutPassword, accessToken, refreshToken }, message: "Đăng nhập thành công" });
  } catch (error) { next(error); }
};

// POST /api/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "refreshToken là bắt buộc" });
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
      return res.status(401).json({ success: false, message: "refreshToken không hợp lệ hoặc đã hết hạn" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId, email: decoded.email, role: decoded.role }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    if (error.name === "JsonWebTokenError") return res.status(401).json({ success: false, message: "Token không hợp lệ" });
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (token) await prisma.refreshToken.deleteMany({ where: { token } });
    res.json({ success: true, message: "Đăng xuất thành công" });
  } catch (error) { next(error); }
};

module.exports = { register, login, refreshToken, getMe, logout };