// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR on ${req.method} ${req.path}:`, err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);

  // Prisma: Unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'field';
    return res.status(409).json({ success: false, message: `Giá trị ${field} đã tồn tại`, code: 'DUPLICATE_ENTRY' });
  }
  // Prisma: Record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi', code: 'NOT_FOUND' });
  }
  // Prisma: Foreign key constraint
  if (err.code === 'P2003') {
    return res.status(400).json({ success: false, message: 'Tham chiếu dữ liệu không hợp lệ', code: 'FOREIGN_KEY_ERROR' });
  }
  // JSON parse error
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'JSON body không hợp lệ', code: 'INVALID_JSON' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Lỗi hệ thống',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
