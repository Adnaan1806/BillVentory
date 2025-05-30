import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: '', price: '', itemCode: '' });
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
        setNewItem({ name: '', description: '', quantity: '', price: '', itemCode: '' });
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

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/user/delete-inventory/${itemToDelete._id}`,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setItems(items.filter(item => item._id !== itemToDelete._id));
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting item");
      console.error(error);
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
    <div className="p-2 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Inventory Items</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setNewItem({ name: '', description: '', quantity: '', price: '', itemCode: '' });
            setIsPopupOpen(true);
          }}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 sm:px-4 border-b text-left">Item Code</th>
                <th className="py-2 px-3 sm:px-4 border-b text-left">Name</th>
                <th className="py-2 px-3 sm:px-4 border-b text-right">Qty</th>
                <th className="py-2 px-3 sm:px-4 border-b text-right">Price (LKR)</th>
                <th className="py-2 px-3 sm:px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-2 px-3 sm:px-4 border-b">
                    <div>{item.itemCode}</div>
                  </td>
                  <td className="py-2 px-3 sm:px-4 border-b">{item.name}</td>
                  <td className="py-2 px-3 sm:px-4 border-b text-right">{item.quantity}</td>
                  <td className="py-2 px-3 sm:px-4 border-b text-right">{item.price}</td>
                  <td className="py-2 px-3 sm:px-4 border-b">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="w-full sm:w-auto text-white bg-yellow-700 py-1 px-4 rounded-md hover:bg-yellow-600 transition-all duration-300 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="w-full sm:w-auto text-white bg-red-500 py-1 px-2 rounded-md hover:bg-red-600 transition-all duration-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Item Code</label>
                <input
                  type="text"
                  name="itemCode"
                  value={editingItem ? editingItem.itemCode : newItem.itemCode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700">Price (LKR)</label>
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
              <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setEditingItem(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Delete Item</h3>
            <p className="mb-4">Are you sure you want to delete {itemToDelete?.name}?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="w-full sm:w-auto px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
