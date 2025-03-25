import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: '', price: '' });
  
  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };
  
  const handleAddItem = () => {
    setItems([...items, newItem]);
    setNewItem({ name: '', description: '', quantity: '', price: '' });
    setIsPopupOpen(false);
  };
  
  const handleEditItem = (index) => {
    setNewItem(items[index]);
    setIsPopupOpen(true);
  };
  
  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Inventory Items</h1>
        <button 
          onClick={() => setIsPopupOpen(true)} 
          className="bg-black text-white py-2 px-6 rounded-md text-md hover:bg-gray-600 transition-all duration-300">
          ADD ITEM
        </button>
      </div>
      
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
            <h2 className="text-2xl font-semibold text-center mb-6">Add New Item</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm mb-2">Item Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newItem.name} 
                  onChange={handleChange} 
                  placeholder="Item Name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">Description</label>
                <input 
                  type="text" 
                  name="description" 
                  value={newItem.description} 
                  onChange={handleChange} 
                  placeholder="Description" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">Quantity</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={newItem.quantity} 
                  onChange={handleChange} 
                  placeholder="Quantity" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">Price</label>
                <input 
                  type="number" 
                  name="price" 
                  value={newItem.price} 
                  onChange={handleChange} 
                  placeholder="Price" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="flex justify-center gap-8">
              <button 
                onClick={handleAddItem} 
                className="bg-teal-500 text-white py-2 px-12 w-40 rounded-md hover:bg-teal-600 transition duration-300">
                Add
              </button>
              <button 
                onClick={() => setIsPopupOpen(false)} 
                className="bg-red-500 text-white py-2 px-7 w-40 rounded-md hover:bg-red-600 transition duration-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <table className="mt-8 w-full table-auto rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-600 text-white text-sm">
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Description</th>
            <th className="px-6 py-4 text-center">Quantity</th>
            <th className="px-6 py-4 text-right">Price</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="bg-gray-100 hover:bg-gray-200">
              <td className="px-6 py-4 text-left">{item.name}</td>
              <td className="px-6 py-4 text-left">{item.description}</td>
              <td className="px-6 py-4 text-center">{item.quantity}</td>
              <td className="px-6 py-4 text-right">${item.price}</td>
              <td className="px-6 py-4 flex justify-center gap-2">
                <button 
                  onClick={() => handleEditItem(index)} 
                  className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300">
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteItem(index)} 
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
