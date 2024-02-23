export const isAdmin = async (req, res, next) => {
  try {
    const { user } = req;

    if (user.role !== 'ADMIN') {
      return res
        .status(401)
        .json({ message: 'Unauthorized - You are not an Admin' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
