import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiSearch } from "react-icons/fi";

const Doctors = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  
  const inventoryItems = [
    { name: 'Item 1', price: 50 },
    { name: 'Item 2', price: 75 },
    { name: 'Item 3', price: 100 },
    { name: 'Item 4', price: 150 },
    { name: 'Item 5', price: 200 },
  ];

  const handleAddItemToBill = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
  };

  const handleRemoveItem = (index) => {
    const itemToRemove = selectedItems[index];
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const totalAmount = selectedItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-8">Billing Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-teal-500 mb-4">Customer Details</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter customer's name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Customer Mobile</label>
          <input
            type="text"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter customer's mobile number"
          />
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-teal-500 mb-4">Select Items to Add to Bill</h2>
        <div className="mb-4">
          <select
            onChange={(e) => handleAddItemToBill(inventoryItems[e.target.selectedIndex])}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select an item</option>
            {inventoryItems.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name} - ${item.price}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-teal-500 mb-4">Selected Items</h2>
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index} className="flex justify-between mb-2 px-4 py-2 border-b">
              <span>{item.name}</span>
              <span className="text-teal-600">${item.price}</span>
              <button
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 hover:text-red-600">
                Remove
              </button>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 flex justify-between">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl text-teal-600">${totalAmount}</span>
        </div>
        
        <button
          className="mt-6 bg-teal-500 text-white py-2 px-6 rounded-md w-full hover:bg-teal-600 transition duration-300">
          Generate Bill
        </button>
      </div>
    </div>
  );
};

export default Doctors;
