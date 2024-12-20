// src/components/Header.tsx

import React from 'react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        {/* Brand Logo */}
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          BUYDATE
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <a href="#" className="text-purple-100 inter hover:text-purple-400 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/tutorial" className="text-purple-100 inter hover:text-purple-400 transition-colors">
                Tutorial
              </a>
            </li>
            <li>
              <a href="#" className="text-purple-100 inter hover:text-purple-400 transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="text-purple-100 inter hover:text-purple-400 transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="text-purple-100 inter hover:text-purple-400 transition-colors">
                FAQs
              </a>
            </li>
          </ul>
        </nav>

        {/* Sign Up Button */}
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Sign Up
        </Button>
      </div>
    </header>
  );
};

export default Header;
