import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Edit2,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

// Format number with thousand separators and 2 decimal places
const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num) || 0);
};

const Analytics = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "Income",
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    recordId: null,
    recordDescription: "",
  });

  // Fetch analytics records
  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/analytics/get-analytics`, {
        headers: { token },
      });
      if (res.data.success) setRecords(res.data.items);
    } catch (e) {
      console.log(e);
    }
  };

  // Filter records by selected date
  useEffect(() => {
    const filtered = records.filter((record) => {
      if (!record.date || !selectedDate) return false;
      return record.date.split("T")[0] === selectedDate;
    });
    setFilteredRecords(filtered);
  }, [records, selectedDate]);

  useEffect(() => {
    fetchRecords();
  }, []);

  // Calculate totals
  const totalIncome = filteredRecords
    .filter((rec) => rec.type === "Income")
    .reduce((sum, rec) => sum + Number(rec.amount), 0);

  const totalExpense = filteredRecords
    .filter((rec) => rec.type === "Expense")
    .reduce((sum, rec) => sum + Number(rec.amount), 0);

  const netResult = totalIncome - totalExpense;
  const isProfit = netResult > 0;

  // Validate form data
  const validateForm = (formData) => {
    const { description, amount, type } = formData;

    if (!description || !amount || !type) {
      alert("Please fill in all fields");
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || !Number.isFinite(amountNum)) {
      alert("Please enter a valid number");
      return false;
    }

    if (amountNum <= 0) {
      alert("Amount must be greater than 0");
      return false;
    }

    const decimalPlaces = (amount.toString().split(".")[1] || "").length;
    if (decimalPlaces > 2) {
      alert("Amount cannot have more than 2 decimal places");
      return false;
    }

    return true;
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Update the amount input field to prevent invalid characters
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setForm({ ...form, amount: value });
    }
  };

  // Add or update record
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(form)) {
      return;
    }

    const recordData = { ...form, date: selectedDate };

    try {
      if (editingId) {
        await axios.put(
          `${backendUrl}/api/analytics/update-analytics/${editingId}`,
          recordData,
          { headers: { token } }
        );
      } else {
        await axios.post(
          `${backendUrl}/api/analytics/add-analytics`,
          recordData,
          { headers: { token } }
        );
      }

      setForm({ description: "", amount: "", type: "Income" });
      setEditingId(null);
      fetchRecords();
    } catch (error) {
      console.error("Error saving record:", error);
      alert(error.response?.data?.message || "Error saving record");
    }
  };

  // Edit record
  const handleEdit = (rec) => {
    setForm({
      description: rec.description,
      amount: rec.amount,
      type: rec.type,
    });
    setEditingId(rec._id);
  };

  // Show delete confirmation
  const showDeleteConfirm = (id, description) => {
    setDeleteConfirm({
      isOpen: true,
      recordId: id,
      recordDescription: description,
    });
  };

  // Close delete confirmation
  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      recordId: null,
      recordDescription: "",
    });
  };

  // Delete record
  const handleDelete = async () => {
    if (!deleteConfirm.recordId) return;

    try {
      await axios.delete(
        `${backendUrl}/api/analytics/delete-analytics/${deleteConfirm.recordId}`,
        {
          headers: { token },
        }
      );
      fetchRecords();
      closeDeleteConfirm();
    } catch (error) {
      console.error("Error deleting record:", error);
      alert(error.response?.data?.message || "Error deleting record");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Delete Confirmation Dialog */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="text-red-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Record
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "
                {deleteConfirm.recordDescription}"? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center md:justify-start gap-3">
          Financial Analytics
        </h1>
        <p className="text-gray-600">
          Track your income and expenses to analyze Profit and Loss
        </p>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Select Date</h2>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add Record Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="text-green" />
          {editingId ? "Edit Record" : "Add New Record"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                value={form.amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="pt-4 sm:pt-0 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={16} />
              {editingId ? "Update Record" : "Add Record"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ description: "", amount: "", type: "Income" });
                  setEditingId(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Records for{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <style jsx>{`
              /* Vertical Scrollbar */
              .scrollbar-thin::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .scrollbar-thin::-webkit-scrollbar-track {
                background: #f3f4f6; /* gray-100 */
                border-radius: 4px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb {
                background: #d1d5db; /* gray-300 */
                border-radius: 4px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: #9ca3af; /* gray-400 */
              }
              /* Horizontal Scrollbar */
              .overflow-x-auto::-webkit-scrollbar {
                height: 10px;
              }
              .overflow-x-auto::-webkit-scrollbar-thumb {
                background: #9ca3af; /* gray-400 */
                border-radius: 4px;
              }
              .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                background: #6b7280; /* gray-500 */
              }
              .overflow-x-auto::-webkit-scrollbar-track {
                background: #f3f4f6; /* gray-100 */
                border-radius: 4px;
                margin: 0 1rem;
              }
            `}</style>
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income (LKR)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expense (LKR)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No records found for the selected date
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => (
                    <tr key={rec._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rec.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {rec.type === "Income" ? (
                          <span className="text-green font-medium">
                            {formatNumber(rec.amount)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {rec.type === "Expense" ? (
                          <span className="text-red-600 font-medium">
                            {formatNumber(rec.amount)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(rec)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              showDeleteConfirm(rec._id, rec.description)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals and Profit/Loss */}
        {filteredRecords.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Total Income (LKR)
                  </span>
                  <TrendingUp className="text-white" size={20} />
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(totalIncome)}
                </p>
              </div>

              <div className="bg-red-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">
                    Total Expense (LKR)
                  </span>
                  <TrendingDown className="text-red-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-red-800">
                  {formatNumber(totalExpense)}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  isProfit ? "bg-blue-100" : "bg-orange-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isProfit ? "text-blue-800" : "text-orange-800"
                    }`}
                  >
                    Net Result (LKR)
                  </span>
                  {isProfit ? (
                    <TrendingUp className="text-blue-600" size={20} />
                  ) : (
                    <TrendingDown className="text-orange-600" size={20} />
                  )}
                </div>
                <p
                  className={`text-2xl font-bold ${
                    isProfit ? "text-blue-800" : "text-orange-800"
                  }`}
                >
                  {isProfit ? "Profit" : "Loss"}:{" "}
                  {formatNumber(Math.abs(netResult))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
