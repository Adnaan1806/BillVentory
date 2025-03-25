import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";

const Sales = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesData, setSalesData] = useState([
    { date: '2025-03-21', amount: 500, itemsSold: 10 },
    { date: '2025-03-22', amount: 700, itemsSold: 12 },
    { date: '2025-03-23', amount: 450, itemsSold: 8 },
    { date: '2025-03-24', amount: 600, itemsSold: 15 },
  ]);
  
  const handleFilter = () => {
    // Here you can implement your filtering logic based on the startDate and endDate
    // For now, we are just logging the date range.
    console.log('Filtering sales between:', startDate, 'and', endDate);
  };

  const filteredSales = salesData.filter(sale => {
    return (!startDate || sale.date >= startDate) && (!endDate || sale.date <= endDate);
  });

  const totalAmount = filteredSales.reduce((total, sale) => total + sale.amount, 0);
  const totalItemsSold = filteredSales.reduce((total, sale) => total + sale.itemsSold, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-8">Sales Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-teal-500 mb-4">Filter by Date</h2>
        <div className="flex gap-4 mb-6">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleFilter}
            className="bg-teal-500 text-white py-2 px-6 rounded-md hover:bg-teal-600 transition duration-300">
            Filter
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-teal-500 mb-4">Sales Overview</h2>
        
        <div className="flex justify-between mb-4">
          <div className="text-lg font-semibold">Total Amount Earned:</div>
          <div className="text-xl text-teal-600">${totalAmount}</div>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="text-lg font-semibold">Total Items Sold:</div>
          <div className="text-xl text-teal-600">{totalItemsSold}</div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
