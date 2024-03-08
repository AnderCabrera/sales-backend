import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connection from './db/mongo.js';
import { hashPassword } from './helpers/bcrypt.js';
import 'dotenv/config';

// Models
import User from './models/user.model.js';
import Product from './models/product.model.js';
import Category from './models/category.model.js';

// Routes
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// Connection
connection()
  .then(async () => {
    // Create admin user
    const admin = await User({
      name: 'Admin',
      lastName: 'Admin',
      username: 'admin',
      password: await hashPassword('admin'),
      role: 'ADMIN',
      cart: [],
      purchases: [],
    });

    const users = await User.find({});

    if (users.length === 0) {
      await admin.save();
    }
  })
  .then(async () => {
    // Create categories
    const categories = await Category.find({});

    if (categories.length === 0) {
      const newCategories = [
        { name: 'General' },
        { name: 'Electronics' },
        { name: 'Clothing' },
        { name: 'Sports' },
        { name: 'Home' },
        { name: 'Technology' },
      ];

      await Category.insertMany(newCategories);
    }
  })
  .then(async () => {
    // Create products
    const products = await Product.find({});

    if (products.length === 0) {
      const newProducts = [
        {
          name: 'Laptop',
          description: 'A laptop',
          price: 1000,
          stock: 10,
          timeSold: 0,
          category: await Category.findOne({ name: 'Electronics' }).select(
            '_id',
          ),
        },
        {
          name: 'T-shirt',
          description: 'A t-shirt',
          price: 20,
          stock: 100,
          timeSold: 0,
          category: await Category.findOne({ name: 'Clothing' }).select('_id'),
        },
        {
          name: 'Soccer ball',
          description: 'A soccer ball',
          price: 50,
          stock: 50,
          timeSold: 0,
          category: await Category.findOne({ name: 'Sports' }).select('_id'),
        },
        {
          name: 'Chair',
          description: 'A chair',
          price: 100,
          stock: 20,
          timeSold: 0,
          category: await Category.findOne({ name: 'Home' }).select('_id'),
        },
      ];

      await Product.insertMany(newProducts);
    }
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on Port ${PORT}`);
    });
  });
