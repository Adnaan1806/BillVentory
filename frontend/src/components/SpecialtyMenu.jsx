import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";

const SpecialtyMenu = () => {
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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-xl">
      <button 
        onClick={() => setIsPopupOpen(true)} 
        className="bg-gradient-to-r from-teal-400 to-teal-600 text-white py-2 px-6 rounded-md text-lg hover:bg-teal-700 transition duration-300">
        + Add Item
      </button>
      
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Add New Item</h2>
            <input 
              type="text" 
              name="name" 
              value={newItem.name} 
              onChange={handleChange} 
              placeholder="Item Name" 
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input 
              type="text" 
              name="description" 
              value={newItem.description} 
              onChange={handleChange} 
              placeholder="Description" 
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input 
              type="number" 
              name="quantity" 
              value={newItem.quantity} 
              onChange={handleChange} 
              placeholder="Quantity" 
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input 
              type="number" 
              name="price" 
              value={newItem.price} 
              onChange={handleChange} 
              placeholder="Price" 
              className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-between">
              <button 
                onClick={handleAddItem} 
                className="bg-teal-500 text-white py-2 px-6 rounded-md hover:bg-teal-600 transition duration-300">
                Add
              </button>
              <button 
                onClick={() => setIsPopupOpen(false)} 
                className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <table className="mt-8 w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-600 text-white text-lg">
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Quantity</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="bg-gray-100 hover:bg-gray-200">
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.description}</td>
              <td className="px-6 py-4">{item.quantity}</td>
              <td className="px-6 py-4">${item.price}</td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => handleEditItem(index)} 
                  className="bg-yellow-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-yellow-600 transition duration-300">
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

export default SpecialtyMenu;
