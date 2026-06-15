const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');

// ─── Initiate Payment ────────────────────────────────────────────────
// POST /api/payment/initiate
// Body: { cartItems: [...], totalAmount, shippingAddress }
router.post('/initiate', protect, async (req, res) => {
  const { cartItems, totalAmount, shippingAddress } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  // Generate a unique transaction reference
  const txRef = `JWL-${req.user._id}-${Date.now()}`;

  try {
    // Calculate expected delivery date based on products
    const productIds = cartItems.map(item => item._id);
    const products = await Product.find({ _id: { $in: productIds } });
    
    let maxDeliveryDuration = 7; // default 7 days
    if (products && products.length > 0) {
      maxDeliveryDuration = Math.max(...products.map(p => p.averageDeliveryDuration || 7));
    }
    
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + maxDeliveryDuration);

    // Save pending order to DB before redirecting
    await Order.create({
      user: req.user._id,
      orderItems: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      })),
      totalAmount,
      txRef,
      paymentStatus: 'pending',
      shippingAddress,
      expectedDeliveryDate,
    });

    // Call Flutterwave Standard Payment API
    const payload = {
      tx_ref: txRef,
      amount: totalAmount,
      currency: 'USD',
      redirect_url: `${process.env.CLIENT_URL}/payment-callback`,
      customer: {
        email: req.user.email,
        name: req.user.name,
      },
      customizations: {
        title: 'Jewelry Store Checkout',
        description: `Payment for ${cartItems.length} item(s)`,
        logo: 'https://res.cloudinary.com/dkz4ykdge/image/upload/v1/jewelry-products/logo',
      },
    };

    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'success') {
      // Return the Flutterwave hosted payment link
      return res.json({ paymentLink: response.data.data.link });
    } else {
      return res.status(500).json({ message: 'Failed to initiate payment' });
    }
  } catch (error) {
    console.error('Payment initiation error:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
});

// ─── Verify Payment ──────────────────────────────────────────────────
// GET /api/payment/verify?transaction_id=xxx&tx_ref=xxx&status=xxx
// Flutterwave redirects here after payment
router.get('/verify', protect, async (req, res) => {
  const { transaction_id, tx_ref, status } = req.query;

  if (status === 'cancelled') {
    if (tx_ref) {
      await Order.findOneAndUpdate({ txRef: tx_ref }, { paymentStatus: 'cancelled' });
    }
    return res.json({ success: false, message: 'Payment was cancelled' });
  }

  try {
    // Verify with Flutterwave
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const flwData = response.data.data;

    if (
      response.data.status === 'success' &&
      flwData.status === 'successful' &&
      flwData.tx_ref === tx_ref
    ) {
      // Update the order in DB
      const order = await Order.findOneAndUpdate(
        { txRef: tx_ref },
        {
          paymentStatus: 'paid',
          flwTransactionId: String(transaction_id),
          paidAt: new Date(),
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        order,
      });
    } else {
      // Mark as failed
      await Order.findOneAndUpdate({ txRef: tx_ref }, { paymentStatus: 'failed' });
      return res.json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verification error:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

module.exports = router;
