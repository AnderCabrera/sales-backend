import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connection from './db/mongo.js';
import { hashPassword } from './helpers/bcrypt.js';
import 'dotenv/config';

// Models
import User from './models/user.model.js';

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
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on Port ${PORT}`);
    });
  });
