const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const helmet = require('helmet');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: false, // Set to false if you have issues with Cloudinary/External images
}));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Jewelry E-commerce API is running...');
});

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');

// routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../jewelry e-commerce/dist');
  app.use(express.static(frontendPath));

  app.get('{/*path}', (req, res) =>
    res.sendFile(path.resolve(frontendPath, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Jewelry E-commerce API is running...');
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
