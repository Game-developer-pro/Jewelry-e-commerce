const express = require('express');
const router = express.Router();
const { authUser, registerUser, verifyEmail, getUserProfile, registerSeller, getSellers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/verify', verifyEmail);
router.post('/login', authUser);
router.get('/sellers', getSellers);
router.post('/register-seller', registerSeller);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
