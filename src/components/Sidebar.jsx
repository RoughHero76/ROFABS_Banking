// src/components/Sidebar.js
import React, { useState } from 'react';
import { FaBars, FaUser, FaHandHoldingHeart, FaMoneyBillWave } from 'react-icons/fa';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside className={`bg-gradient-to-b from-blue-500 to-blue-800 text-white ${isExpanded ? 'w-64' : 'w-16'} min-h-screen transition-width duration-300 shadow-lg`}>
      <div className="flex items-center justify-center py-6">
        <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
          <FaBars />
        </button>
        {isExpanded && (
          <span className="ml-4 text-xl font-bold">Rofabs Banking</span>
        )}
      </div>
      <nav className="py-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center py-3 px-4 hover:bg-blue-600 transition duration-200">
              <FaUser className="mr-3 text-xl h" />
              {isExpanded && <span className="text-lg">User Management</span>}
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center py-3 px-4 hover:bg-blue-600 transition duration-200">
              <FaHandHoldingHeart className="mr-2 text-xl" />
              {isExpanded && <span className="text-lg">Beneficiary Management</span>}
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center py-3 px-4 hover:bg-blue-600 transition duration-200">
              <FaMoneyBillWave className="mr-2 text-xl" />
              {isExpanded && <span className="text-lg">Payment Requests</span>}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;