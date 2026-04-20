const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
  try {
    const { customerId, customerName, customerEmail, items, shippingAddress, note } = req.body;
    const processedItems = items.map(i => ({ ...i, subtotal: i.price * i.quantity }));
    const totalAmount = processedItems.reduce((s, i) => s + i.subtotal, 0);
    const order = await Order.create({ customerId, customerName, customerEmail, items: processedItems, totalAmount, shippingAddress, note });
    res.status(201).json({ success: true, data: order, message: 'Đặt hàng thành công' });
  } catch (error) { next(error); }
};

const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = { customerId: parseInt(customerId) };
    if (status) filter.status = status;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, data: orders, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total/parseInt(limit)) } });
  } catch (error) { next(error); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    res.json({ success: true, data: order });
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, cancelReason } = req.body;
    const validStatuses = ['pending','confirmed','shipping','delivered','cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: `Status phải là: ${validStatuses.join(', ')}` });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    if (['delivered','cancelled'].includes(order.status)) return res.status(409).json({ success: false, message: `Không thể thay đổi đơn ở trạng thái ${order.status}` });
    order.status = status;
    if (status === 'cancelled' && cancelReason) order.cancelReason = cancelReason;
    await order.save();
    res.json({ success: true, data: order, message: 'Cập nhật trạng thái thành công' });
  } catch (error) { next(error); }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page)-1) * parseInt(limit);
    const filter = status ? { status } : {};
    const [orders, total] = await Promise.all([Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)), Order.countDocuments(filter)]);
    res.json({ success: true, data: orders, pagination: { total, page: parseInt(page), totalPages: Math.ceil(total/parseInt(limit)) } });
  } catch (error) { next(error); }
};

module.exports = { createOrder, getOrdersByCustomer, getOrderById, updateOrderStatus, getAllOrders };