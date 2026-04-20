const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message);
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
    return res.status(422).json({ success: false, message: "Dữ liệu không hợp lệ", errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ success: false, message: `${field} đã tồn tại` });
  }
  if (err.name === "CastError") return res.status(400).json({ success: false, message: "ID không hợp lệ" });
  res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi hệ thống" });
};
module.exports = errorHandler;