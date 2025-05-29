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
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Billing =
  mongoose.models.Billing || mongoose.model("Billing", billingSchema);

export default Billing;
