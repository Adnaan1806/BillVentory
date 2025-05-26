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
      const response = await axios.get(backendUrl + "/api/user/get-inventory", {
        headers: { token },
      });

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
    // Check if we're on a mobile device
    if (window.innerWidth <= 768) {
      toast.success("Bill created successfully");
      return;
    }

    const currentDate = new Date();
    const billId = billData._id || `INV-${Date.now()}`;
    
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${billData.customerName}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @page {
              size: 80mm auto;
              margin: 2mm;
            }
            
            body {
              font-family: 'Courier New', monospace;
              font-size: 11px;
              line-height: 1.3;
              color: #000;
              background: white;
              width: 76mm;
              margin: 0 auto;
              padding: 2mm;
            }
            
            .receipt-container {
              width: 100%;
            }
            
            .header {
              text-align: center;
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px dashed #000;
            }
            
            .company-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 2px;
            }
            
            .company-tagline {
              font-size: 9px;
              margin-bottom: 6px;
            }
            
            .receipt-title {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            
            .receipt-info {
              text-align: center;
              margin-bottom: 8px;
              font-size: 10px;
            }
            
            .customer-section {
              margin-bottom: 8px;
              padding-bottom: 6px;
              border-bottom: 1px dashed #000;
            }
            
            .customer-label {
              font-weight: bold;
              font-size: 10px;
            }
            
            .customer-value {
              font-size: 10px;
              margin-bottom: 2px;
            }
            
            .items-section {
              margin-bottom: 8px;
            }
            
            .items-header {
              border-top: 1px solid #000;
              border-bottom: 1px solid #000;
              padding: 3px 0;
              font-weight: bold;
              font-size: 10px;
            }
            
            .item-row {
              padding: 2px 0;
              border-bottom: 1px dotted #ccc;
              font-size: 10px;
            }
            
            .item-name {
              font-weight: bold;
              margin-bottom: 1px;
            }
            
            .item-details {
              display: flex;
              justify-content: space-between;
              font-size: 9px;
            }
            
            .total-section {
              margin-top: 8px;
              padding-top: 6px;
              border-top: 1px dashed #000;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
              font-size: 10px;
            }
            
            .total-row.final {
              font-size: 12px;
              font-weight: bold;
              border-top: 1px solid #000;
              padding-top: 4px;
              margin-top: 6px;
            }
            
            .footer {
              margin-top: 10px;
              padding-top: 8px;
              border-top: 1px dashed #000;
              text-align: center;
              font-size: 9px;
            }
            
            .thank-you {
              font-size: 11px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            
            .print-button {
              display: block;
              margin: 15px auto;
              padding: 8px 16px;
              background-color: #000;
              color: white;
              border: none;
              border-radius: 3px;
              cursor: pointer;
              font-size: 12px;
            }
            
            .print-button:hover {
              background-color: #333;
            }
            
            .divider {
              text-align: center;
              margin: 6px 0;
              font-size: 10px;
            }
            
            @media print {
              .print-button {
                display: none !important;
              }
              
              body {
                width: 80mm;
                margin: 0;
                padding: 2mm;
                font-size: 11px;
              }
              
              @page {
                size: 80mm auto;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Header -->
            <div class="header">
              <div class="company-name">BillVentory</div>
              <div class="company-tagline">Inventory Management System</div>
              <div class="receipt-title">SALES RECEIPT</div>
            </div>
            
            <!-- Receipt Info -->
            <div class="receipt-info">
              <div>Receipt No: ${billId}</div>
              <div>Date: ${currentDate.toLocaleDateString()}</div>
              <div>Time: ${currentDate.toLocaleTimeString()}</div>
            </div>
            
            <!-- Customer Details -->
            <div class="customer-section">
              <div class="customer-label">CUSTOMER DETAILS:</div>
              <div class="customer-value">Name: ${billData.customerName}</div>
              <div class="customer-value">Mobile: ${billData.customerMobile}</div>
            </div>
            
            <!-- Items Section -->
            <div class="items-section">
              <div class="items-header">
                <div style="display: flex; justify-content: space-between;">
                  <span>ITEM</span>
                  <span>QTY x PRICE = TOTAL</span>
                </div>
              </div>
              
              ${billData.items
                .map(
                  (item) => `
                  <div class="item-row">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                      <span>${item.quantity} x ${item.price.toFixed(2)}</span>
                      <span>LKR ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                `
                )
                .join("")}
            </div>
            
            <!-- Total Section -->
            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>LKR ${billData.items.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Tax (0%):</span>
                <span>LKR 0.00</span>
              </div>
              <div class="total-row">
                <span>Discount:</span>
                <span>LKR 0.00</span>
              </div>
              <div class="total-row final">
                <span>TOTAL:</span>
                <span>LKR ${billData.items.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ).toFixed(2)}</span>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="thank-you">Thank you for your purchasing!</div>
              <div class="divider">================================</div>
              <div>Visit us again</div>
              <div>Contact: +94 XX XXX XXXX</div>
            </div>
            
            <!-- Print Button -->
            <button class="print-button" onclick="window.print()">Print Receipt</button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Auto-focus and trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.focus();
    }, 250);
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
        // Print the bill only on desktop
        if (window.innerWidth > 768) {
          printBill({
            _id: response.data.billId || `INV-${Date.now()}`,
            customerName,
            customerMobile,
            items: selectedItems,
          });
        }
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