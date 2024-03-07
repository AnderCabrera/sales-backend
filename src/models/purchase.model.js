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
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
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
