import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const categoryExists = await Category.findOne({});

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
