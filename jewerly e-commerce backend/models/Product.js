const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      minLength: [3, 'Product name must be at least 3 characters long'],
      maxLength: [50, 'Product name must be at most 50 characters long'],
    },
    description: {
      type: String,
      required: true,
      minLength: [10, 'Description must be at least 20 characters long'],
      maxLength: [1000, 'Description must be at most 1000 characters long'],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true, // e.g., 'Rings', 'Earrings', 'Necklaces', 'Bracelets'
      minLength: [3, 'Category must be at least 3 characters long'],
      maxLength: [50, 'Category must be at most 50 characters long'],
    },
    material: {
      type: String,
      minLength: [3, 'Material description must be at least 3 characters long'],
      maxLength: [100, 'Material description must be at most 100 characters long'],
    },
    image: {
      type: String, // Cloudinary image URL will go here
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 1,
    },
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
