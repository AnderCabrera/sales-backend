import express from 'express';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

import {
  getAllPurchases,
  downloadPurchases,
  modifyUserClient,
  getAllUsers,
  deleteUser,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(productRoutes);
router.use(categoryRoutes);

router.get('/all/users', [isLoggedIn, isAdmin], getAllUsers);
router.get('/all/purchases', [isLoggedIn, isAdmin], getAllPurchases);
// TODO: fix permissions
router.get('/download/purchases/:id', [isLoggedIn], downloadPurchases);
router.put('/modify/user/:id', [isLoggedIn, isAdmin], modifyUserClient);
router.delete('/delete/user/:id', [isLoggedIn, isAdmin], deleteUser);

export default router;
