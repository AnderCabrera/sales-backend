import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

// Controllers
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/products', isLoggedIn, getProducts);
router.post('/add/product', [isLoggedIn, isAdmin], addProduct);
router.put('/update/product/:productId', [isLoggedIn, isAdmin], updateProduct);
router.delete(
  '/delete/product/:productId',
  [isLoggedIn, isAdmin],
  deleteProduct,
);

export default router;
