// src/components/Sidebar.js
import React, { useState } from 'react';
import { FaBars, FaUser, FaHandHoldingHeart, FaMoneyBillWave } from 'react-icons/fa';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside className={`bg-gray-800 text-white ${isExpanded ? 'w-64' : 'w-16'} min-h-screen transition-width duration-300`}>
      <div className="flex items-center justify-center py-4">
        <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
          <FaBars />
        </button>
      </div>
      <nav className="py-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center py-2 px-4 hover:bg-gray-700">
              <FaUser className="mr-2" />
              {isExpanded && <span>User Management</span>}
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center py-2 px-4 hover:bg-gray-700">
              <FaHandHoldingHeart className="mr-2" />
              {isExpanded && <span>Beneficiary Management</span>}
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center py-2 px-4 hover:bg-gray-700">
              <FaMoneyBillWave className="mr-2" />
              {isExpanded && <span>Payment Requests</span>}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;