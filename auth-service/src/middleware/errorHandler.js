const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message);
  if (err.code === "P2002") return res.status(409).json({ success: false, message: "Email đã tồn tại" });
  if (err.code === "P2025") return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi" });
  res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi hệ thống" });
};
module.exports = errorHandler;