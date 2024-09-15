import Purchase from '../models/purchase.model.js';
import User from '../models/user.model.js';
import fs from 'fs';
import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({})
      .populate('user', '-_id -password -cart -purchases')
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

    res.json(purchases);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const downloadPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findOne({ _id: req.params.id })
      .populate('user', '-_id -password -cart -purchases')
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

    const doc = new jsPDF();

    doc.setFontSize(10);
    const header = `Purchase Date: ${purchases.createdAt.toString().slice(0, 25)}`;
    const user = `User: ${purchases.user.name} ${purchases.user.lastName}`;
    const username = `Username: ${purchases.user.username}`;

    doc.setFontSize(10).setFont(undefined, 'bold');
    doc.text(header, 15, 10).setFontSize(10).setFont(undefined, 'bold');
    doc.text(user, 15, 15).setFontSize(10).setFont(undefined, 'bold');
    doc.text(username, 15, 20).setFontSize(10).setFont(undefined, 'bold');

    doc.autoTable({
      startY: 30,
      head: [['Product Name', 'Quantity', 'Price', 'Subtotal']],
      body: purchases.products.map((purchase) => [
        purchase.product.name,
        purchase.quantity,
        `$${purchase.product.price}`,
        `$${purchase.subtotal}`,
      ]),
    });

    let finalY = doc.lastAutoTable.finalY;
    doc.text(174, finalY + 10, `Total: $${purchases.total}`);

    doc.text(
      'Thank you for your purchase!',
      105,
      finalY + 20,
      null,
      null,
      'center',
    );

    const fileName = `purchase_${purchases._id}.pdf`;
    const folderPath = './downloads';

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const filePath = `${folderPath}/${fileName}`;

    doc.save(filePath);

    res.json({ message: 'Downloaded' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'CLIENT' }, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const modifyUserClient = async (req, res) => {
  try {
    const { name, lastName, username, password, role } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);

    const userWithSameUsername = await User.findOne({ username });

    if (userWithSameUsername && userWithSameUsername._id.toString() !== id) {
      return res
        .status(400)
        .json({ message: 'Username already exists, use another' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ message: 'Cannot modify an admin' });
    }

    if (password) {
      user.password = await hashPassword(password);
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

    if (role) {
      user.role = role;
    }

    await user.save();

    res.json({ message: 'User modified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ message: 'Cannot delete an admin' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
