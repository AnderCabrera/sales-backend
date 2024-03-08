import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

// Controllers
import {
  login,
  register,
  profile,
  update,
  deleteUser,
  updatePassword,
  getCart,
  addTocart,
  purchase,
  removeFromCart,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', isLoggedIn, profile);
router.put('/update', isLoggedIn, update);
router.put('/update/password', isLoggedIn, updatePassword);
router.delete('/delete', isLoggedIn, deleteUser);

// Cart
router.get('/cart', isLoggedIn, getCart);
router.post('/cart', isLoggedIn, addTocart);
router.post('/cart/purchase', isLoggedIn, purchase);
router.delete('/cart/delete/:productId', isLoggedIn, removeFromCart);

export default router;
