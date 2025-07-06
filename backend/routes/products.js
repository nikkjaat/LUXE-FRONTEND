import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByVendor,
  searchProducts,
  getProductReviews,
  addProductReview,
  updateProductReview,
  deleteProductReview
} from '../controllers/productController.js';
import { protect, authorize, vendorAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['accessories', 'women', 'men', 'home', 'electronics', 'beauty', 'sports', 'kids']).withMessage('Invalid category'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
];

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.post('/:id/reviews', protect, authorize('user'), reviewValidation, validate, addProductReview);
router.put('/reviews/:reviewId', protect, updateProductReview);
router.delete('/reviews/:reviewId', protect, deleteProductReview);

// Vendor routes
router.post('/', protect, vendorAuth, upload.array('images', 5), productValidation, validate, createProduct);
router.put('/:id', protect, vendorAuth, upload.array('images', 5), productValidation, validate, updateProduct);
router.delete('/:id', protect, vendorAuth, deleteProduct);
router.get('/vendor/my-products', protect, vendorAuth, getProductsByVendor);

export default router;