import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import { generateToken } from '../helpers/jwt.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

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
    const user = await User.findById({ _id: req.user._id }).select('-_id');

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
