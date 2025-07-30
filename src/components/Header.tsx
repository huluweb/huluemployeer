// components/Header.tsx
import React from 'react';
import { HiBell, HiSearch, HiUserCircle } from 'react-icons/hi';

interface HeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <div className="relative max-w-md w-full hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
            <HiBell className="h-6 w-6" />
          </button>
          
          <div className="relative">
            <button className="flex items-center text-sm focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-dashed"></div>
              <span className="ml-2 hidden md:block text-gray-700 font-medium">John Doe</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;