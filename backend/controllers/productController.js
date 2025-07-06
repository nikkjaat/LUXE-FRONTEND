import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'active', isActive: true };

    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Filter by rating
    if (req.query.minRating) {
      query['rating.average'] = { $gte: parseFloat(req.query.minRating) };
    }

    // Search by name or description
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'rating':
        sort['rating.average'] = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const products = await Product.find(query)
      .populate('vendor', 'vendorInfo.shopName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'vendorInfo.shopName vendorInfo.status')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor)
export const createProduct = async (req, res, next) => {
  try {
    // Add vendor to req.body
    req.body.vendor = req.user.id;
    req.body.vendorName = req.user.vendorInfo.shopName;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageUploads = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer, 'products'))
      );
      req.body.images = imageUploads.map(upload => ({
        url: upload.secure_url,
        publicId: upload.public_id
      }));
    }

    const product = await Product.create(req.body);

    // Update vendor's product count
    req.user.vendorInfo.totalProducts += 1;
    await req.user.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor - own products only)
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Make sure user is product owner
    if (product.vendor.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      // Delete old images from cloudinary
      if (product.images && product.images.length > 0) {
        await Promise.all(
          product.images.map(image => 
            image.publicId ? deleteFromCloudinary(image.publicId) : Promise.resolve()
          )
        );
      }

      // Upload new images
      const imageUploads = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer, 'products'))
      );
      req.body.images = imageUploads.map(upload => ({
        url: upload.secure_url,
        publicId: upload.public_id
      }));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor - own products only)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Make sure user is product owner
    if (product.vendor.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Delete images from cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(image => 
          image.publicId ? deleteFromCloudinary(image.publicId) : Promise.resolve()
        )
      );
    }

    await product.deleteOne();

    // Update vendor's product count
    req.user.vendorInfo.totalProducts = Math.max(0, req.user.vendorInfo.totalProducts - 1);
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by vendor
// @route   GET /api/products/vendor/my-products
// @access  Private (Vendor)
export const getProductsByVendor = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ vendor: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ vendor: req.user.id });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let query = { status: 'active', isActive: true };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { 'rating.average': -1 };

    const products = await Product.find(query)
      .populate('vendor', 'vendorInfo.shopName')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private (User)
export const addProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: req.params.id,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = await Review.create({
      rating,
      title,
      comment,
      product: req.params.id,
      user: req.user.id
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product review
// @route   PUT /api/products/reviews/:reviewId
// @access  Private (User - own reviews only)
export const updateProductReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/reviews/:reviewId
// @access  Private (User - own reviews only)
export const deleteProductReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};