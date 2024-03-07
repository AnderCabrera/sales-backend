import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({
        message: 'Category already exists',
      });
    }

    const newCategory = new Category({
      name,
    });

    await newCategory.save();

    return res.status(200).send('Category added succesfully');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const categoryExists = await Category.findById(categoryId);
    const categoryWithSameName = await Category.findOne({ name });

    if (!categoryExists) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    if (categoryWithSameName) {
      return res.status(400).json({
        message: 'Category already exists',
      });
    }

    await Category.findByIdAndUpdate(categoryId, { name }, { new: true });

    return res.status(200).json({
      message: 'Category updated succesfully',
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const categoryExists = await Category.findById(categoryId);

    if (!categoryExists) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    const products = await Product.find({ category: categoryId }).populate(
      'category',
    );

    if (products.length > 0) {
      return res.status(400).json({
        message: 'Category is being used by a product',
        products,
      });
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).send('Category deleted succesfully');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
