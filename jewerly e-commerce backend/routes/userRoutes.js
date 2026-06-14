const express = require('express');
const router = express.Router();
const { authUser, registerUser, verifyEmail, getUserProfile, registerSeller, getSellers, updateUserProfile, uploadProfilePic, uploadProfilePicMiddleware } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/verify', verifyEmail);
router.post('/login', authUser);
router.get('/sellers', getSellers);
router.post('/register-seller', uploadProfilePicMiddleware, registerSeller);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/profile/picture', protect, uploadProfilePicMiddleware, uploadProfilePic);
module.exports = router;
