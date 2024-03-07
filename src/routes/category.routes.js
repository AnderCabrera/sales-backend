import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

// Controllers
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';

const router = express.Router();

router.get(
  '/categories',
  /*[isLoggedIn, isAdmin],*/
  getCategories,
);
router.post(
  '/add/category',
  /*[isLoggedIn, isAdmin],*/
  addCategory,
);
router.put(
  '/update/category/:categoryId',
  /*[isLoggedIn, isAdmin],*/
  updateCategory,
);
router.delete(
  '/delete/category/:categoryId',
  /*[isLoggedIn, isAdmin],*/
  deleteCategory,
);

export default router;
