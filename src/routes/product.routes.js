import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

// Controllers
import {
  getProducts,
  getProductsMostSold,
  searchProducts,
  getProductsByCategory,
  getProductsSoldOut,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/products', isLoggedIn, getProducts);
router.get('/products/most-sold', isLoggedIn, getProductsMostSold);
router.post('/search/products', isLoggedIn, searchProducts);
router.get(
  '/products/category/:categoryName',
  isLoggedIn,
  getProductsByCategory,
);
router.get('/products/sold-out', isLoggedIn, getProductsSoldOut);

router.post('/add/product', [isLoggedIn, isAdmin], addProduct);
router.put('/update/product/:productId', [isLoggedIn, isAdmin], updateProduct);
router.delete(
  '/delete/product/:productId',
  [isLoggedIn, isAdmin],
  deleteProduct,
);

export default router;
