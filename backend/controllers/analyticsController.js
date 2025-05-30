import Analytics from "../models/AnalyticsModel.js";

const addAnalytics = async (req, res) => {
  try {
    const { description, date, amount, type } = req.body;

    // Validate input
    if (!description || !amount || !type) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    if (!["Income", "Expense"].includes(type)) {
      return res.json({
        success: false,
        message: "Type must be either 'Income' or 'Expense'",
      });
    }

    // Convert to number and validate amount
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || !Number.isFinite(amountNum)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number",
      });
    }

    // Check for positive number with max 2 decimal places
    if (amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Check decimal places
    const decimalPlaces = (amountNum.toString().split(".")[1] || "").length;
    if (decimalPlaces > 2) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot have more than 2 decimal places",
      });
    }

    // Create analytics item
    const newAnalytics = new Analytics({
      description,
      date,
      amount: Number(amount),
      type,
    });

    await newAnalytics.save();

    res.json({
      success: true,
      message: "Record added successfully",
      newAnalytics,
    });
  } catch (error) {
    console.error("Error adding analytics:", error);
    res.json({
      success: false,
      message: error.message || "Error adding analytics",
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const items = await Analytics.find();
    res.json({ success: true, items });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, date, amount, type } = req.body;

    // Validate input
    if (!description || !amount || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }

    if (!["Income", "Expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'Income' or 'Expense'",
      });
    }

    // Convert to number and validate amount
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || !Number.isFinite(amountNum)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number",
      });
    }

    // Check for positive number with max 2 decimal places
    if (amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Check decimal places
    const decimalPlaces = (amountNum.toString().split(".")[1] || "").length;
    if (decimalPlaces > 2) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot have more than 2 decimal places",
      });
    }

    const updatedItem = await Analytics.findByIdAndUpdate(
      id,
      {
        description,
        date,
        amount: amountNum,
        type,
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.json({
      success: true,
      message: "Record updated successfully",
      updatedItem,
    });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating record",
    });
  }
};

const deleteAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Analytics.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addAnalytics, getAnalytics, updateAnalytics, deleteAnalytics };
