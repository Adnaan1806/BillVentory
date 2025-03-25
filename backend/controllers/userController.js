import validator from "validator";
import bcrypt from "bcrypt";
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
      res.json({ success: true, token });
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
    const { name, description, quantity, price } = req.body;

    // Validate input
    if (!name || !description || !quantity || !price) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    if (quantity < 0 || price < 0) {
      return res.json({
        success: false,
        message: "Quantity and price must be positive values",
      });
    }

    // Create inventory item
    const newItem = new Inventory({
      name,
      description,
      quantity,
      price,
    });

    await newItem.save();

    res.json({ success: true, message: "Inventory item added successfully", newItem });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
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
    const { name, description, quantity, price } = req.body;

    // Validate input
    if (!name || !description || !quantity || !price) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    if (quantity < 0 || price < 0) {
      return res.json({
        success: false,
        message: "Quantity and price must be positive values",
      });
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, description, quantity, price },
      { new: true }
    );

    if (!updatedItem) {
      return res.json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
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
    const { customerName, customerMobile, items } = req.body;

    // Validate input
    if (!customerName || !customerMobile || !items || items.length === 0) {
      return res.json({ success: false, message: "Please provide all required fields" });
    }

    // Calculate total amount and update inventory
    let totalAmount = 0;
    for (const item of items) {
      const inventoryItem = await Inventory.findById(item.itemId);
      if (!inventoryItem) {
        return res.json({ success: false, message: `Item ${item.name} not found in inventory` });
      }
      if (inventoryItem.quantity < item.quantity) {
        return res.json({ success: false, message: `Insufficient stock for ${item.name}` });
      }
      
      // Update inventory quantity using updateOne to skip validation
      await Inventory.updateOne(
        { _id: item.itemId },
        { $inc: { quantity: -item.quantity } }
      );
      
      totalAmount += item.price * item.quantity;
    }

    // Create new bill
    const newBill = new Billing({
      customerName,
      customerMobile,
      items,
      totalAmount,
    });

    await newBill.save();

    res.json({ 
      success: true, 
      message: "Bill created successfully", 
      bill: newBill 
    });
  } catch (error) {
    console.log(error);
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
  getBillById 
};
