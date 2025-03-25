import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: '', price: '' });
  const [editingItem, setEditingItem] = useState(null);
  const { backendUrl, token } = useContext(AppContext);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/user/get-inventory",
        { headers: { token } }
      );

      if (response.data.success) {
        setItems(response.data.items);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching inventory");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };
  
  const handleAddItem = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/add-inventory",
        newItem,
        { headers: { token } }
      );
      
      if (data.success) {
        toast.success(data.message);
        setItems([...items, data.newItem]);
        setNewItem({ name: '', description: '', quantity: '', price: '' });
        setIsPopupOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding item");
      console.error(error);
    }
  };
  
  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsPopupOpen(true);
  };

  const handleUpdateItem = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/update-inventory/${editingItem._id}`,
        editingItem,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setItems(items.map(item => 
          item._id === editingItem._id ? data.updatedItem : item
        ));
        setEditingItem(null);
        setIsPopupOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating item");
      console.error(error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const { data } = await axios.delete(
          `${backendUrl}/api/user/delete-inventory/${id}`,
          { headers: { token } }
        );

        if (data.success) {
          toast.success(data.message);
          setItems(items.filter(item => item._id !== id));
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error deleting item");
        console.error(error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      handleUpdateItem();
    } else {
      handleAddItem();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Inventory Items</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setNewItem({ name: '', description: '', quantity: '', price: '' });
            setIsPopupOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-right">Quantity</th>
              <th className="py-2 px-4 border-b text-right">Price</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.description}</td>
                <td className="py-2 px-4 border-b text-right">{item.quantity}</td>
                <td className="py-2 px-4 border-b text-right">${item.price}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[600px]">
            <h3 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingItem ? editingItem.name : newItem.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={editingItem ? editingItem.description : newItem.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editingItem ? editingItem.quantity : newItem.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingItem ? editingItem.price : newItem.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
