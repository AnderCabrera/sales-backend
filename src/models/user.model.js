import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
          quantity: {
            type: Number,
            required: true,
            default: 1,
          },
        },
      ],
      required: false,
    },
    purchases: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Purchase',
        },
      ],
      required: false,
    },
    role: {
      type: String,
      enum: ['CLIENT', 'ADMIN'],
      default: 'CLIENT',
      required: false,
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model('User', userSchema);
