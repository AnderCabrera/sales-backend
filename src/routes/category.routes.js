import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

// Controllers
import { addCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.post(
  '/add/category',
  /*[isLoggedIn, isAdmin],*/
  addCategory,
);

export default router;
