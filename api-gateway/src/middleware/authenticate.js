const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

// Middleware xác thực JWT — dùng trong Gateway
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Chưa đăng nhập. Cần Bearer token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Inject user info vào header để forward tới service
    req.headers["x-user-id"] = String(decoded.userId);
    req.headers["x-user-email"] = decoded.email;
    req.headers["x-user-role"] = decoded.role;
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Token đã hết hạn" : "Token không hợp lệ";
    res.status(401).json({ success: false, message: msg });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.headers["x-user-role"] !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Chỉ Admin mới có quyền" });
  }
  next();
};

module.exports = { authenticate, requireAdmin };