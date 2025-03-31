import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiSearch, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

const Billing = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate mobile number format
  const validateMobileNumber = (number) => {
    // Allow empty string during typing
    if (number === "") return true;
    
    // Check if it starts with + and has 12 digits
    if (number.startsWith("+")) {
      return /^\+\d{11}$/.test(number);
    }
    
    // Check if it has exactly 10 digits
    return /^\d{10}$/.test(number);
  };

  // Handle mobile number change
  const handleMobileChange = (e) => {
    const number = e.target.value;
    
    // Only allow digits and + at the start
    if (!/^[+\d]*$/.test(number)) return;
    
    // If + is present, it must be at the start
    if (number.includes("+") && number[0] !== "+") return;
    
    // Limit length based on whether it starts with +
    if (number.startsWith("+") && number.length > 12) return;
    if (!number.startsWith("+") && number.length > 10) return;
    
    setCustomerMobile(number);
  };

  // Fetch inventory items
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {

      const response = await axios.get(
        backendUrl + "/api/user/get-inventory",
        { headers: { token } }
      );

      if (response.data.success) {
        setInventoryItems(response.data.items);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to fetch inventory items");
    }
  };

  const handleAddItemToBill = (item) => {
    const existingItem = selectedItems.find((i) => i.itemId === item._id);
    if (existingItem) {
      if (existingItem.quantity >= item.quantity) {
        toast.error("Insufficient stock");
        return;
      }
      setSelectedItems(
        selectedItems.map((i) =>
          i.itemId === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (index, change) => {
    const item = selectedItems[index];
    const inventoryItem = inventoryItems.find((i) => i._id === item.itemId);

    if (change > 0 && item.quantity >= inventoryItem.quantity) {
      toast.error("Insufficient stock");
      return;
    }

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      handleRemoveItem(index);
      return;
    }

    setSelectedItems(
      selectedItems.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const printBill = (billData) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - ${billData.customerName}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 15px; 
              margin: 0;
              box-sizing: border-box;
            }
            .header { 
              text-align: center; 
              margin-bottom: 15px;
              padding: 10px;
            }
            .customer-info { 
              margin-bottom: 15px;
              padding: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 15px;
              font-size: 14px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left;
            }
            th { background-color: #f5f5f5; }
            .total { 
              text-align: right; 
              font-weight: bold;
              padding: 10px;
              margin-top: 10px;
            }
            button {
              width: 100%;
              padding: 12px;
              background-color: #4CAF50;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 20px;
            }
            button:hover {
              background-color: #45a049;
            }
            @media print {
              button { display: none; }
              body { font-size: 12px; }
              table { font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BillVentory</h1>
            <p>Bill Date: ${new Date().toLocaleString()}</p>
          </div>
          <div class="customer-info">
            <p><strong>Customer Name:</strong> ${billData.customerName}</p>
            <p><strong>Mobile:</strong> ${billData.customerMobile}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price(LKR)</th>
                <th>Total(LKR)</th>
              </tr>
            </thead>
            <tbody>
              ${billData.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Total Amount: LKR ${billData.items.reduce((total, item) => total + (item.price * item.quantity), 0)}</p>
          </div>
          <button onclick="window.print()">Print Bill</button>
        </body>
      </html>
    `);
    printWindow.document.close();

    // Focus and print automatically on mobile
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  const handleCreateBill = async () => {
    if (!customerName || !customerMobile) {
      toast.error("Please enter customer details");
      return;
    }
    if (!validateMobileNumber(customerMobile)) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please add items to the bill");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/user/create-bill",
        {
          customerName,
          customerMobile,
          items: selectedItems,
          totalAmount,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Bill created successfully");
        // Print the bill
        printBill({
          customerName,
          customerMobile,
          items: selectedItems,
        });
        // Reset form
        setCustomerName("");
        setCustomerMobile("");
        setSelectedItems([]);
        fetchInventoryItems();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      toast.error("Failed to create bill");
    }
    setLoading(false);
  };

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.quantity > 0
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Customer Info and Items List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create New Bill</h2>

          {/* Customer Details */}
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div>
              <input
                type="text"
                placeholder="Mobile Number (10 digits or +91xxxxxxxxxx)"
                value={customerMobile}
                onChange={handleMobileChange}
                className={`w-full p-2 border rounded ${
                  customerMobile && !validateMobileNumber(customerMobile)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {customerMobile && !validateMobileNumber(customerMobile) && (
                <p className="text-red-500 text-sm mt-1">
                  Enter 10 digits or +91 followed by 10 digits
                </p>
              )}
            </div>
          </div>

          {/* Search Items */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 p-2 border rounded"
            />
          </div>

          {/* Items List */}
          <div className="h-96 overflow-y-auto border rounded">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 border-b"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Stock: {item.quantity} | Price: LKR {item.price}
                  </p>
                </div>
                <button
                  onClick={() => handleAddItemToBill(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <FiPlus />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Bill Preview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Bill Preview</h2>

          {/* Selected Items */}
          <div className="space-y-4 mb-6">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    LKR {item.price} x {item.quantity} = LKR{" "}
                    {item.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(index, -1)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(index, 1)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FiPlus />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Create Bill Button */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total Amount:</span>
              <span className="text-xl font-semibold">LKR {totalAmount}</span>
            </div>
            <button
              onClick={handleCreateBill}
              disabled={loading || selectedItems.length === 0}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Bill..." : "Create Bill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
