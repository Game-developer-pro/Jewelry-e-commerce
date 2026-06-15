import express from 'express';
const router = express.Router();

// Get all products (demo)
router.get('/', (req, res) => {
  res.json({ products: [] });
});

// Get product by id (demo)
router.get('/:id', (req, res) => {
  res.json({ product: { id: req.params.id } });
});

// Create product (seller) - demo
router.post('/', (req, res) => {
  res.json({ message: 'Product created (demo)' });
});

export default router;
