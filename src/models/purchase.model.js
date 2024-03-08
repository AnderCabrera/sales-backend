import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('Purchase', purchaseSchema);
