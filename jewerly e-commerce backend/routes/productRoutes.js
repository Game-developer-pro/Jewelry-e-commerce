const express = require('express');
const router = express.Router();
const { getProducts, createProduct, getProductById, updateProduct } = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/:id').get(getProductById).put(protect, seller, updateProduct);

module.exports = router;
