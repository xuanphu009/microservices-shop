// src/middleware/validate.js
const { body, validationResult } = require('express-validator');

// Xử lý kết quả validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Validation rules cho Product
const productValidation = [
  body('name')
    .notEmpty().withMessage('Tên sản phẩm không được rỗng')
    .isLength({ min: 2, max: 200 }).withMessage('Tên phải từ 2-200 ký tự')
    .trim(),
  body('price')
    .notEmpty().withMessage('Giá là bắt buộc')
    .isFloat({ min: 0 }).withMessage('Giá phải là số không âm'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Số lượng phải là số nguyên >= 0'),
  body('categoryId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('categoryId phải là số nguyên dương'),
  body('imageUrl')
    .optional({ nullable: true })
    .isURL().withMessage('imageUrl phải là URL hợp lệ'),
  handleValidation,
];

// Validation rules cho Category
const categoryValidation = [
  body('name')
    .notEmpty().withMessage('Tên danh mục không được rỗng')
    .isLength({ min: 2, max: 100 }).withMessage('Tên phải từ 2-100 ký tự')
    .trim(),
  handleValidation,
];

module.exports = { productValidation, categoryValidation, handleValidation };
