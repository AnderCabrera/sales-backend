import express from 'express';
import Product from '../models/product.model.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import { generateToken } from '../helpers/jwt.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.post(
  '/add/product',
  /*[isLoggedIn, isAdmin],*/ async (req, res) => {
    try {
      let { name, description, price, stock, category } = req.body;

      const products = await Product.find({});
      let productAlreadyExists = products.some(
        (product) => product.name === name,
      );

      if (productAlreadyExists) {
        let productToUpdate = await Product.findOne({ name });

        await Product.findOneAndUpdate(
          { name },
          {
            stock: productToUpdate.stock + 1,
          },
          { new: true },
        );

        return res.send({
          message: 'The product exists added +1 to this product',
        });
      }

      const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category,
      });

      await newProduct.save();

      return res.status(200).send('Product added succesfully');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

router.put(
  '/update/product/:productName',
  /*[isLoggedIn, isAdmin],*/ async (req, res) => {
    try {
      const { productName } = req.params;
      const { name, description, price, stock, category } = req.body;

      const productToUpdate = await Product.findOne({ name: productName });

      if (!productToUpdate) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await Product.findOneAndUpdate(
        { name: productName },
        { name, description, price, stock, category },
        { new: true },
      );

      return res.json({ message: 'Course updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

router.delete(
  '/delete/product/:productName',
  /*[isLoggedIn, isAdmin],*/
  async (req, res) => {
    try {
      const { productName } = req.params;

      const productToDelete = await Product.findOne({ name: productName });

      if (!productToDelete) {
        return res.status(404).json({ message: 'Course not found' });
      }

      await Product.findOneAndDelete({ name: productName });

      return res.json({ message: 'Course deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

export default router;
