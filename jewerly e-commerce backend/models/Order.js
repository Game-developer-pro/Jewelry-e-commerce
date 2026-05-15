const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    // Flutterwave transaction reference
    txRef: { type: String, required: true, unique: true },
    // Payment status: pending | paid | failed
    paymentStatus: { type: String, default: 'pending' },
    // Flutterwave's own transaction ID (set after verification)
    flwTransactionId: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
