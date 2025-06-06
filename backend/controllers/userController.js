import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import Stripe from "stripe";
import Inventory from "../models/InventoryModel.js";
import Billing from "../models/BillingModel.js";
//API to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    // validating email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    // Validate password strength
    const strongPasswordOptions = {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    };

    if (!validator.isStrongPassword(password, strongPasswordOptions)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    //creating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to login user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get users profile data

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update users profile data

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const addInventory = async (req, res) => {
  try {
    const { name, description, quantity, price, itemCode } = req.body;

    // Validate input
    if (!name || !description || !quantity || !price || !itemCode) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    if (quantity < 0 || price < 0) {
      return res.json({
        success: false,
        message: "Quantity and price must be positive values",
      });
    }

    // Validate itemCode
    const itemCodeStr = String(itemCode).trim();
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (itemCodeStr.length === 0) {
      return res.json({
        success: false,
        message: "Item code cannot be empty",
      });
    }

    if (itemCodeStr.length > 5) {
      return res.json({
        success: false,
        message: "Item code cannot be more than 5 characters",
      });
    }

    if (!alphanumericRegex.test(itemCodeStr)) {
      return res.json({
        success: false,
        message:
          "Item code can only contain letters and numbers (no special characters or spaces)",
      });
    }

    // Check for existing item with same code
    const existingItem = await Inventory.findOne({ itemCode: itemCodeStr });
    if (existingItem) {
      return res.json({
        success: false,
        message: "An item with this code already exists",
      });
    }

    // Create inventory item
    const newItem = new Inventory({
      name,
      description,
      quantity: Number(quantity),
      price: Number(price),
      itemCode: itemCodeStr,
    });

    await newItem.save();

    res.json({
      success: true,
      message: "Inventory item added successfully",
      newItem,
    });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.json({
      success: false,
      message: error.message || "Error adding inventory item",
    });
  }
};

const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json({ success: true, items });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price, itemCode } = req.body;

    // Validate input
    if (!name || !description || !quantity || !price || !itemCode) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    if (quantity < 0 || price < 0) {
      return res.json({
        success: false,
        message: "Quantity and price must be positive values",
      });
    }

    // Validate itemCode
    const itemCodeStr = String(itemCode).trim();
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (itemCodeStr.length === 0) {
      return res.json({
        success: false,
        message: "Item code cannot be empty",
      });
    }

    if (itemCodeStr.length > 5) {
      return res.json({
        success: false,
        message: "Item code cannot be more than 5 characters",
      });
    }

    if (!alphanumericRegex.test(itemCodeStr)) {
      return res.json({
        success: false,
        message:
          "Item code can only contain letters and numbers (no special characters or spaces)",
      });
    }

    // Check if another item with the same code already exists (excluding current item)
    const existingItem = await Inventory.findOne({
      _id: { $ne: id }, // Exclude current item
      itemCode: itemCodeStr,
    });

    if (existingItem) {
      return res.json({
        success: false,
        message: "An item with this code already exists",
      });
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      {
        name,
        description,
        quantity: Number(quantity),
        price: Number(price),
        itemCode: itemCodeStr,
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.json({ success: false, message: "Item not found" });
    }

    res.json({
      success: true,
      message: "Item updated successfully",
      updatedItem,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.json({
      success: false,
      message: error.message || "Error updating inventory item",
    });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const createBill = async (req, res) => {
  try {
    const {
      customerName,
      customerMobile,
      items,
      discountType,
      discountValue,
      totalPaid: totalPaidFromRequest,
    } = req.body;

    // Validate input
    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "Please add an item to the bill",
      });
    }

    // Calculate subtotal and update inventory
    let subtotal = 0;
    for (const item of items) {
      const inventoryItem = await Inventory.findById(item.itemId);
      if (!inventoryItem) {
        return res.json({
          success: false,
          message: `Item ${item.name} not found in inventory`,
        });
      }
      if (inventoryItem.quantity < item.quantity) {
        return res.json({
          success: false,
          message: `Insufficient stock for ${item.name}`,
        });
      }

      // Update inventory quantity using updateOne to skip validation
      await Inventory.updateOne(
        { _id: item.itemId },
        { $inc: { quantity: -item.quantity } }
      );

      subtotal += item.price * item.quantity;
    }

    // Initialize discount variables
    let discountAmount = 0;
    let finalDiscountType = null;
    let finalDiscountValue = 0;

    // Calculate discount only if discountType and discountValue are provided
    if (discountType && discountValue && discountValue > 0) {
      finalDiscountType = discountType;
      finalDiscountValue = discountValue;

      if (discountType === "percentage") {
        // Ensure percentage doesn't exceed 100%
        const validPercentage = Math.min(discountValue, 100);
        discountAmount = (subtotal * validPercentage) / 100;
        finalDiscountValue = validPercentage;
      } else if (discountType === "fixed") {
        // Ensure fixed discount doesn't exceed subtotal
        discountAmount = Math.min(discountValue, subtotal);
      }
    }

    // Calculate total amount after discount
    const totalAmount = Math.max(0, subtotal - discountAmount);

    // Validate and process totalPaid
    const totalPaid = parseFloat(totalPaidFromRequest) || 0;

    if (totalPaid < 0) {
      return res.json({
        success: false,
        message: "Paid amount cannot be negative",
      });
    }

    if (totalPaid > totalAmount) {
      return res.json({
        success: false,
        message: "Paid amount cannot be greater than the total amount",
      });
    }

    // Calculate due amount
    const dueAmount = totalAmount - totalPaid;

    // Create new bill with explicit values
    const billData = {
      customerName: customerName || "",
      customerMobile: customerMobile || "",
      items,
      subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
      discountType: finalDiscountType,
      discountValue: finalDiscountValue,
      discountAmount: Math.round(discountAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100, // Add totalPaid
      dueAmount: Math.round(dueAmount * 100) / 100, // Add dueAmount
    };

    console.log("Bill data before saving:", billData); // Debug log

    const newBill = new Billing(billData);
    const savedBill = await newBill.save();

    console.log("Saved bill:", savedBill); // Debug log

    res.json({
      success: true,
      message: "Bill created successfully",
      bill: savedBill,
      billId: savedBill._id,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.json({ success: false, message: error.message });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await Billing.find().sort({ date: -1 });
    res.json({ success: true, bills });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Billing.findById(id);

    if (!bill) {
      return res.json({ success: false, message: "Bill not found" });
    }

    res.json({ success: true, bill });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  addInventory,
  getInventory,
  updateInventory,
  deleteInventory,
  createBill,
  getBills,
  getBillById,
};
