import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name');

    return res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsMostSold = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ timesSold: -1 });

    return res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      const products = await Product.find({}).populate('category', 'name -_id');

      return res.json({
        message: 'No search parameters provided, returning all products',
        products,
      });
    }

    const products = await Product.find({ name: { $regex: name } });

    if (!products) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id });

    if (!products) {
      return res.status(404).json({ message: 'Products not found' });
    }

    return res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsSoldOut = async (req, res) => {
  try {
    const products = await Product.find({ stock: 0 });

    if (!products) {
      return res.status(404).json({ message: 'Products not found' });
    }

    return res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    let { name, description, price, stock, category } = req.body;

    const categories = await Category.find({});
    const categoryExists = await Category.findOne({ name: category });

    if (!categoryExists) {
      return res.status(400).json({
        message: 'Category not found',
        categoriesAvailable: categories.map((category) => category.name),
      });
    }

    const products = await Product.find({});

    const productAlreadyExists = products.some(
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
      category: categoryExists._id,
    });

    await newProduct.save();

    return res.status(200).send('Product added succesfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, stock, category } = req.body;

    const productToUpdate = await Product.findById(productId);

    if (!productToUpdate) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (category) {
      const categories = await Category.find({});
      const categoryExists = await Category.findOne({ name: category });

      if (!categoryExists) {
        return res.status(400).json({
          message: 'Category does not exist',
          categoriesAvailable: categories.map((category) => category.name),
        });
      }

      productToUpdate.category = categoryExists._id;
    }

    if (name) {
      productToUpdate.name = name;
    }

    if (description) {
      productToUpdate.description = description;
    }

    if (price) {
      productToUpdate.price = price;
    }

    if (stock) {
      productToUpdate.stock = stock;
    }

    await productToUpdate.save();

    return res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const productToDelete = await Product.findById(productId);

    if (!productToDelete) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findOneAndDelete(productId);

    return res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
