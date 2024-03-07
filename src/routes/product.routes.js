import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

// Controllers
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

router.post(
  '/add/product',
  /*[isLoggedIn, isAdmin],*/
  addProduct,
);
router.put(
  '/update/product/:productId',
  /*[isLoggedIn, isAdmin],*/
  updateProduct,
);
router.delete(
  '/delete/product/:productName',
  /*[isLoggedIn, isAdmin],*/
  deleteProduct,
);

export default router;
