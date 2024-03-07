import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    stock: {
      type: Number,
      min: 0,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model('Product', productSchema);
