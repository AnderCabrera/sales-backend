import Purchase from '../models/purchase.model.js';

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
