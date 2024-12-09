// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Notebook,
  BookMarked,
  BarChart2,
  Settings as SettingsIcon
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/' },
  { icon: BookOpen, text: 'Daily Journal', path: '/journal' },
  { icon: TrendingUp, text: 'Trades', path: '/trades' },
  { icon: Notebook, text: 'Notebook', path: '/notebook' },
  { icon: BookMarked, text: 'Playbook', path: '/playbook' },
  { icon: BarChart2, text: 'Reports', path: '/reports' },
  { icon: SettingsIcon, text: 'Settings', path: '/settings' }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#0B1A33] h-screen fixed left-0 text-white p-4">
      <div className="flex items-center mb-8 pl-0">
        <h1 className="text-2xl font-bold">Bluenotes</h1>
      </div>

      <Link
        to="/add-trade"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mb-6 flex items-center justify-center gap-2"
      >
        <span className="text-lg">+</span>Add Trade
      </Link>

      <nav>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-white/10'
            } mb-1`}
          >
            <item.icon size={20} />
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/10">
          <span>Log Out</span>
        <div
          onClick={() => {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }}
        >
          <span>Log Out</span>
        </div>
        </div>
      </div>
    </div>
  );
}
