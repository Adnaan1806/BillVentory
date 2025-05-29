import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Item name
  description: { type: String, required: true }, // Optional description
  price: { type: Number, required: true }, // Item price
  itemCode: { type: String, required: true, unique:true },
  quantity: { type: Number, required: true, default: 0 }, // Stock available
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the item was added
});

const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;
