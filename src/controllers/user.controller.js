import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Purchase from '../models/purchase.model.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import { generateToken } from '../helpers/jwt.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (isPasswordValid) {
      let loggedUser = {
        uid: user._id,
        username: username,
        role: user.role,
      };

      const token = await generateToken(loggedUser);

      return res.send({
        message: 'Logged in',
        token,
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, lastName, username, password } = req.body;

    const user = new User({
      name,
      lastName,
      username,
      password: await hashPassword(password),
      role: 'CLIENT',
      cart: [],
      purchases: [],
    });

    const users = await User.find({});

    let userAlreadyExists = users.some((user) => user.username === username);

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ message: 'Username already exists, use another' });
    }

    await user.save();

    return res.json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id })
      .select('-_id')
      .populate({
        path: 'cart',
        populate: {
          path: 'product',
          select: '-_id',
          populate: {
            path: 'category',
            select: '-_id',
          },
        },
      })
      .populate({
        path: 'purchases',
        select: '-_id -user',
        populate: {
          path: 'products',
          select: '-_id',
          populate: {
            path: 'product',
            select: '-_id',
            populate: {
              path: 'category',
              select: '-_id',
            },
          },
        },
      });

    return res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { name, lastName, username } = req.body;

    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (username) {
      user.username = username;
    }

    await user.save();

    return res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    user.password = await hashPassword(newPassword);

    await user.save();

    return res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.user._id });

    return res.json({ message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).populate({
      path: 'cart.product',
      select: 'name price',
    });

    return res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTocart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findOne({ _id: req.user._id });
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(400).json({ message: 'Product does not exist' });
    }

    const existingCartItem = user.cart.find(
      (item) => item.product.toString() === productId,
    );

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + (Number(quantity) || 1);

      console.log(newQuantity, product.stock);

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: 'Exceeded product stock',
          yourCart: existingCartItem.quantity,
          stockAviliable: product.stock,
        });
      }

      existingCartItem.quantity = newQuantity;
    } else {
      if (quantity && quantity > product.stock) {
        return res.status(400).json({
          message: 'Exceeded product stock',
          stockAviliable: product.stock,
        });
      }

      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();

    return res.json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findOne({ _id: req.user._id });

    const existingCartItem = user.cart.find(
      (item) => item.product.toString() === productId,
    );

    if (!existingCartItem) {
      return res.status(400).json({ message: 'Product not in cart' });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId,
    );

    await user.save();

    return res.json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const purchase = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).populate({
      path: 'cart.product',
      select: 'name price stock',
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItems = user.cart;

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const purchaseItems = [];

    let total = 0;

    for (const cartItem of cartItems) {
      const product = cartItem.product;
      const quantity = cartItem.quantity;

      if (quantity > product.stock) {
        return res.status(400).json({
          message: 'Exceeded product stock',
          productName: product.name,
          stockAvailable: product.stock,
        });
      }

      const purchaseItem = {
        product: product._id,
        quantity,
        price: product.price,
      };

      purchaseItems.push(purchaseItem);

      total += product.price * quantity;

      product.stock -= quantity;
      await product.save();
    }

    const purchase = new Purchase({
      user: user._id,
      products: purchaseItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      total,
    });

    await purchase.save();

    user.purchases.push(purchase._id);
    user.cart = [];
    await user.save();

    return res.redirect(`/admin/download/purchases/${purchase._id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .select('-_id -user')
      .populate({
        path: 'products',
        select: '-_id',
        populate: {
          path: 'product',
          select: '-_id',
          populate: {
            path: 'category',
            select: '-_id',
          },
        },
      });

    return res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
