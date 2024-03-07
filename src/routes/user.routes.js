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
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', isLoggedIn, profile);
router.put('/update', isLoggedIn, update);
router.put('/update/password', isLoggedIn, updatePassword);
router.delete('/delete', isLoggedIn, deleteUser);

export default router;
