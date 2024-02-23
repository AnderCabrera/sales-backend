import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connection from './db/mongo.js';
import 'dotenv/config';

import userRoutes from './routes/user.routes.js';

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

// Connection
connection().then(() => {
  app.listen(PORT, () => {
    console.log(`server listening on Port ${PORT}`);
  });
});
