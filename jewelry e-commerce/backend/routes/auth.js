import express from 'express';
const router = express.Router();

// Register a new user (seller or customer). For demo, just return success.
router.post('/register', (req, res) => {
  // TODO: validate input, hash password, store in DB
  res.json({ message: 'User registered (demo)' });
});

// Login and return JWT token (demo placeholder)
router.post('/login', (req, res) => {
  // TODO: verify credentials, generate JWT
  res.json({ token: 'demo-jwt-token' });
});

export default router;
