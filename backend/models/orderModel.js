import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    payment: { type: Boolean, default: false },
    stripeSessionId: { type: String, default: null },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;