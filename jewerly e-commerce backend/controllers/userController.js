const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const multer = require('multer');
const path = require('path');

// Multer setup for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploads in a dedicated folder within the backend
    const uploadPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Use user ID if available, otherwise temp name
    const prefix = req.user ? req.user._id : `temp-${Date.now()}`;
    cb(null, `${prefix}${ext}`);
  },
});

const uploadProfilePicMiddleware = multer({ storage }).single('profilePic');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      isVerified: true, // Normal users are auto-verified
    });

    if (user) {
      const { sendWelcomingEmail } = require('../email/mailer.js');
      sendWelcomingEmail(user.email, user.name);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify user email
// @route   POST /api/users/verify
// @access  Public
const verifyEmail = async (req, res) => {
  console.log('Verify Email request received:', req.body);
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      console.log('Missing email or code in request');
      return res.status(400).json({ message: 'Email and code are required' });
    }

    console.log(`Searching for user with email: ${email} and code: ${code}`);
    const user = await User.findOne({
      email,
      verificationCode: code,
    });

    if (!user) {
      console.log(`User not found with code ${code} for ${email}`);
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    console.log(`Checking expiration for ${email}. Expire: ${user.verificationCodeExpire}`);
    if (user.verificationCodeExpire && user.verificationCodeExpire < new Date()) {
      console.log(`Code expired for ${email}`);
      return res.status(400).json({ message: 'Verification code expired' });
    }

    console.log(`User found: ${user._id}. Updating verification status...`);
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;

    console.log('Saving user...');
    await user.save();

    console.log(`Verification successful for ${email}. Generating token...`);
    if (typeof generateToken !== 'function') {
      console.error('generateToken is not a function!');
      throw new Error('Internal server configuration error: generateToken missing');
    }

    const token = generateToken(user._id.toString());

    console.log('Sending success response');
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      isVerified: user.isVerified,
      token,
    });
  } catch (error) {
    console.error('CRITICAL ERROR in verifyEmail:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isVerified: user.isVerified,
        ...(user.isSeller && { storeName: user.storeName, phone: user.phone, bio: user.bio, profilePic: user.profilePic }),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register a new seller
// @route   POST /api/users/register-seller
// @access  Public
const registerSeller = async (req, res) => {
  const { name, email, password, storeName, phone, bio } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      isSeller: true,
      storeName,
      phone,
      bio,
      verificationCode,
      verificationCodeExpire,
      profilePic: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    if (user) {
      if (req.file) {
        const fs = require('fs');
        const oldPath = req.file.path;
        const newFilename = `${user._id}${path.extname(req.file.originalname)}`;
        const newPath = path.join(req.file.destination, newFilename);
        fs.renameSync(oldPath, newPath);
        user.profilePic = `/uploads/${newFilename}`;
        await user.save();
      }
      const { sendVerificationEmail } = require('../email/mailer.js');
      sendVerificationEmail(user.email, user.name, verificationCode);

      res.status(201).json({
        message: 'Seller registration successful. Please check your email for the verification code.',
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerSeller:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all sellers
// @route   GET /api/users/sellers
// @access  Public
const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ isSeller: true }).select('-password');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile (including seller fields)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { name, email, password, storeName, phone, bio } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password; // pre-save hook will hash
      if (user.isSeller) {
        if (storeName) user.storeName = storeName;
        if (phone) user.phone = phone;
        if (bio) user.bio = bio;
      }
      await user.save();
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isVerified: user.isVerified,
        token,
        ...(user.isSeller && { storeName: user.storeName, phone: user.phone, bio: user.bio }),
        ...(user.isSeller && { profilePic: user.profilePic }),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/picture
// @access  Private
const uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.file) {
      // Store relative path for front‑end use
      user.profilePic = `/uploads/${req.file.filename}`;
      await user.save();
    }
    res.json({ message: 'Profile picture uploaded', profilePic: user.profilePic });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  authUser,
  registerUser,
  verifyEmail,
  getUserProfile,
  registerSeller,
  getSellers,
  updateUserProfile,
  uploadProfilePic,
  uploadProfilePicMiddleware,
};
