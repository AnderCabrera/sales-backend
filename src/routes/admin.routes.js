import express from 'express';
import Product from '../models/product.model.js';
import productRoutes from './product.routes.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import { generateToken } from '../helpers/jwt.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.use(productRoutes);

export default router;
