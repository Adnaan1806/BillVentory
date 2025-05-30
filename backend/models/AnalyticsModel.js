import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    amount: {
      type: String,
      required: [true, "Amount is required"],
      validate: {
        validator: function (v) {
          return /^\d+(\.\d{1,2})?$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid amount! Please enter a valid number with up to 2 decimal places.`,
      },
    },
    type: {
      type: String,
      enum: {
        values: ["Income", "Expense"],
        message: 'Type must be either "Income" or "Expense"',
      },
      required: [true, "Type is required (Income/Expense)"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Analytics =
  mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);

export default Analytics;
