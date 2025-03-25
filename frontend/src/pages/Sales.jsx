import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Sales = () => {
  const { backendUrl, token } = useContext(AppContext);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all bills
  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + "/api/user/get-bills", {
        headers: { token },
      });
      console.log("Bills response:", response.data);
      if (response.data.success) {
        setBills(response.data.bills);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Filter bills based on date range and search query
  const filteredBills = bills.filter((bill) => {
    // Convert bill date to YYYY-MM-DD format for comparison
    const billDate = new Date(bill.date).toISOString().split("T")[0];

    // Date range filter
    if (startDate && endDate) {
      const dateInRange = billDate >= startDate && billDate <= endDate;
      if (!dateInRange) return false;
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        bill._id.toLowerCase().includes(query) ||
        bill.customerName.toLowerCase().includes(query) ||
        bill.customerMobile.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate analytics
  const analytics = {
    totalSales: filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0),
    totalBills: filteredBills.length,
    averageBillAmount: filteredBills.length
      ? (
          filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0) /
          filteredBills.length
        ).toFixed(2)
      : 0,
    itemsSold: filteredBills.reduce(
      (sum, bill) =>
        sum + bill.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    ),
  };

  // View bill details
  const viewBillDetails = async (billId) => {
    try {
      const response = await axios.get(
        backendUrl + "/api/user/get-bill/" + billId,
        { headers: { token } }
      );
      if (response.data.success) {
        setSelectedBill(response.data.bill);
        setShowBillModal(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching bill details:", error);
      toast.error("Failed to fetch bill details");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold">Sales Analytics</h1>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, mobile, or bill ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col w-full sm:w-auto">
            <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">
              From
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">
              To
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm text-blue-600 font-medium">Total Sales (LKR)</h3>
            <p className="text-xl sm:text-2xl font-bold">
              {analytics.totalSales.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm text-green-600 font-medium">Total Bills</h3>
            <p className="text-xl sm:text-2xl font-bold">
              {analytics.totalBills}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm text-purple-600 font-medium">
              Average Bill Amount (LKR)
            </h3>
            <p className="text-xl sm:text-2xl font-bold">
              {analytics.averageBillAmount}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm text-orange-600 font-medium">
              Total Inventory Sold
            </h3>
            <p className="text-xl sm:text-2xl font-bold">
              {analytics.itemsSold}
            </p>
          </div>
        </div>

        {/* Bills Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (LKR)
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No bills found
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {bill.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bill.customerMobile}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        {bill.items.length} items
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {bill.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => viewBillDetails(bill._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bill Details Modal */}
      {showBillModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Bill Details</h2>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Customer Details</p>
                <p className="font-medium">{selectedBill.customerName}</p>
                <p className="text-gray-600">{selectedBill.customerMobile}</p>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <p className="text-sm text-gray-500 mb-2 px-4 sm:px-0">
                    Items
                  </p>
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Item
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Qty
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Price (LKR)
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Total (LKR)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedBill.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 sm:px-4 py-2 text-sm">
                            {item.name}
                          </td>
                          <td className="px-3 sm:px-4 py-2 text-sm">
                            {item.quantity}
                          </td>
                          <td className="px-3 sm:px-4 py-2 text-sm">
                            {item.price.toFixed(2)}
                          </td>
                          <td className="px-3 sm:px-4 py-2 text-sm">
                            {(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan="3"
                          className="px-3 sm:px-4 py-2 text-sm font-medium text-right"
                        >
                          Total Amount (LKR):
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-sm font-medium">
                          {selectedBill.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="text-sm text-gray-500 px-4 sm:px-0">
                Bill Date: {new Date(selectedBill.date).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
