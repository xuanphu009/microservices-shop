const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Chưa đăng nhập. Vui lòng cung cấp Bearer token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Token đã hết hạn" : "Token không hợp lệ";
    res.status(401).json({ success: false, message: msg });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "Không có quyền truy cập" });
  next();
};

module.exports = { authenticate, requireAdmin };