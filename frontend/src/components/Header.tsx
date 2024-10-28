import React from 'react';
import { Bell, Filter, Calendar } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
            <Filter size={18} />
            <span>Filters</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
            <Calendar size={18} />
            <span>Date range</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
            <span>Demo Data</span>
          </button>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}