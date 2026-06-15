const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    } else if (req.query.discounted === 'true') {
      filter.discount = { $exists: true };
    } else if (req.query.seller) {
      filter.user = req.query.seller;
    }

    const products = await Product.find(filter).populate('user', 'name storeName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public (Should be Private/Admin but kept Public for testing)
const createProduct = async (req, res) => {
  const { name, description, price, category, material, image, countInStock, discount, averageDeliveryDuration } = req.body;

  try {
    const productData = {
      user: req.user._id,
      name,
      description,
      price,
      category,
      material,
      image,
      countInStock,
      averageDeliveryDuration: averageDeliveryDuration !== undefined ? Number(averageDeliveryDuration) : 7,
    };

    // Only add discount if it's provided and valid
    if (discount && discount >= 1 && discount <= 99) {
      productData.discount = discount;
    }

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'name storeName');

    if (product) {
      let sellerProductCount = 0;
      if (product.user) {
        sellerProductCount = await Product.countDocuments({ user: product.user._id });
      }

      const productObj = product.toObject();
      productObj.sellerProductCount = sellerProductCount;

      res.json(productObj);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  const { name, description, price, category, material, image, countInStock, discount, averageDeliveryDuration } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user is owner or admin
      if (product.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(401).json({ message: 'Not authorized to update this product' });
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.material = material || product.material;
      product.image = image || product.image;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.averageDeliveryDuration = averageDeliveryDuration !== undefined ? Number(averageDeliveryDuration) : product.averageDeliveryDuration;
      
      // Handle discount specifically (allowing removal if 0 or null)
      if (discount === 0 || discount === null || discount === '') {
        product.discount = undefined;
      } else if (discount >= 1 && discount <= 99) {
        product.discount = discount;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

module.exports = { getProducts, createProduct, getProductById, updateProduct };
