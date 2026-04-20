const mongoose = require('mongoose');
const OrderItemSchema = new mongoose.Schema({ productId: { type: Number, required: true }, productName: { type: String, required: true }, price: { type: Number, required: true, min: 0 }, quantity: { type: Number, required: true, min: 1 }, subtotal: { type: Number, required: true } }, { _id: false });
const ShippingAddressSchema = new mongoose.Schema({ street: String, district: String, city: { type: String, required: true }, phone: String }, { _id: false });
const OrderSchema = new mongoose.Schema({
  orderCode: { type: String, unique: true },
  customerId: { type: Number, required: true },
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, lowercase: true, trim: true },
  items: { type: [OrderItemSchema], required: true, validate: { validator: v => v.length > 0, message: 'Phải có ít nhất 1 sản phẩm' } },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending','confirmed','shipping','delivered','cancelled'], default: 'pending' },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  note: { type: String, maxlength: 500 },
  cancelReason: String,
}, { timestamps: true, versionKey: false });
OrderSchema.pre('save', async function(next) {
  if (!this.orderCode) {
    const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const count = await mongoose.model('Order').countDocuments();
    this.orderCode = `ORD-${date}-${String(count+1).padStart(4,'0')}`;
  }
  next();
});
OrderSchema.virtual('totalItems').get(function() { return this.items.reduce((s,i) => s+i.quantity, 0); });
OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
module.exports = mongoose.model('Order', OrderSchema);