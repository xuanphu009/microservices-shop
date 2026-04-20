const { body, validationResult } = require("express-validator");
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, message: "Dữ liệu không hợp lệ", errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
  next();
};
const registerValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Mật khẩu phải ít nhất 6 ký tự"),
  body("name").notEmpty().withMessage("Tên không được rỗng").isLength({ min: 2 }).withMessage("Tên phải ít nhất 2 ký tự").trim(),
  handleValidation,
];
const loginValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("password").notEmpty().withMessage("Mật khẩu không được rỗng"),
  handleValidation,
];
module.exports = { registerValidation, loginValidation };