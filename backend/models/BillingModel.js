import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  customerName: { type: String },
  customerMobile: { type: String },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true,
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  discountType: {
    type: String,
    enum: ["percentage", "fixed", null],
    default: null,
  },
  discountValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: { type: Number, required: true },
  totalPaid: { type: Number, required: true, default: 0 },
  dueAmount: { type: Number, required: true, default: 0 },
  date: { type: Date, default: Date.now },
});

const Billing =
  mongoose.models.Billing || mongoose.model("Billing", billingSchema);

export default Billing;
