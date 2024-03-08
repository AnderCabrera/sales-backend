import express from 'express';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

import { getAllPurchases } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(productRoutes);
router.use(categoryRoutes);

router.get('/all/purchases', [isLoggedIn, isAdmin], getAllPurchases);

export default router;
