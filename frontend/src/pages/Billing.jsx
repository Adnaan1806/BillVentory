import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiSearch, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

const Billing = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [totalPaid, setTotalPaid] = useState(0);

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

  const subtotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate discount amount
  const discountAmount = (() => {
    if (!discountValue || parseFloat(discountValue) <= 0) return 0;

    const value = parseFloat(discountValue);
    if (discountType === "percentage") {
      return (subtotal * value) / 100;
    } else {
      return Math.min(value, subtotal);
    }
  })();

  // Calculate total after discount
  const totalAmount = subtotal - discountAmount;

  // Calculate due amount
  const dueAmount = totalAmount - (parseFloat(totalPaid) || 0);

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
              <div>Billed by: ${userData.name}</div>
              <div>Date: ${currentDate.toLocaleDateString()}</div>
              <div>Time: ${currentDate.toLocaleTimeString()}</div>
            </div>
            
            <!-- Customer Details -->
            ${
              billData.customerName || billData.customerMobile
                ? `
            <div class="customer-section">
              <div class="customer-label">CUSTOMER DETAILS:</div>
              ${
                billData.customerName
                  ? `<div class="customer-value">Name: ${billData.customerName}</div>`
                  : ""
              }
              ${
                billData.customerMobile
                  ? `<div class="customer-value">Mobile: ${billData.customerMobile}</div>`
                  : ""
              }
            </div>`
                : ""
            }
            
            <!-- Items Section -->
            <div class="items-section">
              <div class="items-header">
                <div style="display: flex; justify-content: space-between;">
                  <span>ITEM</span>
                  <span>QTY x PRICE = TOTAL(LKR)</span>
                </div>
              </div>
              
              ${billData.items
                .map(
                  (item) => `
                  <div class="item-row">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                      <span>${item.quantity} x ${item.price.toFixed(2)}</span>
                      <span>${(item.price * item.quantity).toFixed(
                        2
                      )}</span>
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
                <span>LKR ${billData.subtotal.toFixed(2)}</span>
              </div>
              ${
                billData.discountType && billData.discountValue
                  ? `
                <div class="total-row">
                  <span>Discount (${
                    billData.discountType === "percentage"
                      ? billData.discountValue + "%"
                      : "LKR " + billData.discountValue
                  }):</span>
                  <span> - ${billData.discountAmount.toFixed(2)}</span>
                </div>
              `
                  : ""
              }
              <div class="total-row final">
                <span>TOTAL:</span>
                <span>LKR ${billData.totalAmount.toFixed(2)}</span>
              </div>
              <div class="total-row final">
                <span>TOTAL PAID:</span>
                <span>LKR ${billData.totalPaid.toFixed(2)}</span>
              </div>
              <div class="total-row final">
                <span>DUE AMOUNT:</span>
                <span>LKR ${billData.dueAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="thank-you">Thank you for purchasing!</div>
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
    if (!validateMobileNumber(customerMobile)) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please add items to the bill");
      return;
    }

    // Check if discount input is shown but no value is entered
    if (showDiscountInput && !discountValue) {
      setDiscountError("Please enter a discount value or remove the discount");
      return;
    }

    // Additional validation for discount
    if (discountValue) {
      const numValue = parseFloat(discountValue);
      if (isNaN(numValue)) {
        setDiscountError("Please enter a valid discount value");
        return;
      }

      if (discountType === "percentage") {
        if (numValue <= 0 || numValue > 100) {
          setDiscountError("Discount must be between 0.01% and 100%");
          return;
        }
      } else {
        // Fixed amount validation
        if (numValue <= 0) {
          setDiscountError("Discount must be greater than 0");
          return;
        }
        if (numValue > subtotal) {
          setDiscountError("Discount cannot exceed subtotal amount");
          return;
        }
      }
    }

    if (parseFloat(totalPaid) > totalAmount) {
      toast.error("Paid amount cannot be greater than total amount");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        customerName,
        customerMobile,
        items: selectedItems,
      };

      // Only include discount fields if a discount is applied
      if (discountValue && parseFloat(discountValue) > 0) {
        requestData.discountType = discountType;
        requestData.discountValue = parseFloat(discountValue);
      }

      requestData.totalPaid = parseFloat(totalPaid) || 0;
      requestData.dueAmount = dueAmount;

      const response = await axios.post(
        backendUrl + "/api/user/create-bill",
        requestData,
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
            subtotal,
            discountType: discountValue ? discountType : null,
            discountValue: discountValue ? parseFloat(discountValue) : 0,
            discountAmount,
            totalAmount,
            totalPaid: parseFloat(totalPaid) || 0,
            dueAmount,
          });
        }
        // Reset form
        setCustomerName("");
        setCustomerMobile("");
        setSelectedItems([]);
        setDiscountType("percentage");
        setDiscountValue("");
        setShowDiscountInput(false);
        setTotalPaid(0);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      toast.error("Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscountChange = (value) => {
    // Allow empty string for backspace/delete
    if (value === "") {
      setDiscountValue("");
      setDiscountError("");
      return;
    }

    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    // Check for multiple decimal points
    if ((value.match(/\./g) || []).length > 1) {
      return;
    }

    // Check decimal places - limit to 2 decimal places
    const decimalParts = value.split(".");
    if (decimalParts[1] && decimalParts[1].length > 2) {
      return; // Don't allow more than 2 decimal places
    }

    // Set the value first
    setDiscountValue(value);

    // If the input ends with a decimal point, don't validate yet
    if (value.endsWith(".")) {
      setDiscountError("");
      return;
    }

    // Convert to number for validation
    const numValue = parseFloat(value);

    // Check if it's a valid number
    if (isNaN(numValue)) {
      setDiscountError("Please enter a valid number");
      return;
    }

    // Validate based on discount type
    if (discountType === "percentage") {
      if (numValue <= 0) {
        setDiscountError("Discount must be greater than 0%");
      } else if (numValue > 100) {
        setDiscountError("Discount cannot exceed 100%");
      } else {
        setDiscountError("");
      }
    } else {
      // Fixed amount validation
      if (numValue <= 0) {
        setDiscountError("Discount must be greater than 0");
      } else if (numValue > subtotal) {
        setDiscountError("Discount cannot exceed subtotal amount");
      } else {
        setDiscountError("");
      }
    }
  };

  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);

    if (discountValue) {
      // Reset validation when changing type
      const numValue = parseFloat(discountValue);

      if (isNaN(numValue) || discountValue.endsWith(".")) {
        setDiscountError("");
        return;
      }

      // Validate against new type's constraints
      if (type === "percentage") {
        if (numValue <= 0) {
          setDiscountError("Discount must be greater than 0%");
        } else if (numValue > 100) {
          setDiscountError("Discount cannot exceed 100%");
        } else {
          setDiscountError("");
        }
      } else {
        // Fixed amount
        if (numValue <= 0) {
          setDiscountError("Discount must be greater than 0");
        } else if (numValue > subtotal) {
          setDiscountError("Discount cannot exceed subtotal amount");
        } else {
          setDiscountError("");
        }
      }
    }
  };

  const handleTotalPaidChange = (value) => {
    // Allow empty string for backspace/delete
    if (value === "") {
      setTotalPaid("");
      return;
    }

    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    // Check for multiple decimal points
    if ((value.match(/\./g) || []).length > 1) {
      return;
    }

    // Check decimal places - limit to 2 decimal places
    const decimalParts = value.split(".");
    if (decimalParts[1] && decimalParts[1].length > 2) {
      return; // Don't allow more than 2 decimal places
    }

    // Set the value first
    setTotalPaid(value);

    // If the input ends with a decimal point, don't validate yet
    if (value.endsWith(".")) {
      return;
    }

    // Convert to number for validation
    const numValue = parseFloat(value);

    // Check if it's a valid number
    if (isNaN(numValue)) {
      return;
    }

    // Validate if paid amount exceeds total amount
    if (numValue > totalAmount) {
      toast.error("Paid amount cannot be greater than total amount");
    }
  };

  const filteredItems = inventoryItems.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.itemCode &&
          item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()))) &&
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
              placeholder="Search items by Item code and Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 p-2 border rounded"
            />
          </div>

          {/* Items List */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Available Items</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-3 border rounded hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Item Code: {item.itemCode} | Stock: {item.quantity} |
                        Price: LKR {item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddItemToBill(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiPlus />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {searchQuery
                    ? "No items found matching your search"
                    : "No items available"}
                </div>
              )}
            </div>
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
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>LKR {subtotal.toFixed(2)}</span>
              </div>

              {/* Discount Section */}
              <div className="border-t pt-2">
                {showDiscountInput ? (
                  <div className="space-y-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <select
                        value={discountType}
                        onChange={(e) =>
                          handleDiscountTypeChange(e.target.value)
                        }
                        className="p-1 border rounded text-sm"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                      </select>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={discountValue}
                          onChange={(e) => handleDiscountChange(e.target.value)}
                          onBlur={() => {
                            if (showDiscountInput && !discountValue) {
                              setDiscountError("Please enter a discount value");
                            }
                          }}
                          placeholder={
                            discountType === "percentage" ? "0.00" : "0.00"
                          }
                          className={`w-full p-2 border rounded text-sm ${
                            discountError ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setDiscountValue("");
                          setDiscountError("");
                          setShowDiscountInput(false);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    {/* Error message displayed below the input */}
                    {discountError && (
                      <div className="text-xs text-red-500 mt-1">
                        {discountError}
                      </div>
                    )}

                    {discountValue && !discountError && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Discount:</span>
                        <span>-LKR {discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDiscountInput(true)}
                    className="text-sm text-blue-400 mb-2"
                  >
                    + Add Discount
                  </button>
                )}
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>LKR {totalAmount.toFixed(2)}</span>
              </div>

              {/* Total Paid Input */}
              <div className="mt-4">
                <label
                  htmlFor="totalPaid"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Paid (LKR)
                </label>
                <input
                  type="number"
                  id="totalPaid"
                  name="totalPaid"
                  value={totalPaid}
                  onChange={(e) => handleTotalPaidChange(e.target.value)}
                  onBlur={(e) => {
                    // Format to two decimal places on blur if it's a valid number
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setTotalPaid(value.toFixed(2));
                    } else {
                      setTotalPaid(0); // Default to 0 if input is invalid
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  placeholder="0.00"
                />
              </div>

              {/* Due Amount Display */}
              <div className="mt-4 p-3 bg-red-50 rounded-md">
                <div className="text-lg font-semibold text-red-600">
                  Due Amount: LKR {dueAmount.toFixed(2)}
                </div>
              </div>
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
