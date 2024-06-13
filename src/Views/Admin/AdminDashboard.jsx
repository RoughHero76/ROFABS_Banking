// src/views/Admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHandHoldingHeart, FaMoneyCheckAlt } from 'react-icons/fa';
import { API_URL } from '../../../secrets';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [designation, setDesignation] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedDesignation = localStorage.getItem('designation');
    setDesignation(storedDesignation);

    if (!storedToken) {
      navigate('/login');
    } else {
      setToken(storedToken);
    }
  }, []);

  const handleUserManagement = () => {
    navigate('/userManagement');
  };

  const handleBeneficiaryManagement = () => {
    navigate('/beneficiariesManagement');
  };

  const handlePaymentRequests = () => {
    navigate('/paymentRequests');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div
              onClick={handleUserManagement}
              className="bg-gradient-to-r from-purple-700 to-purple-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <FaUsers className="mr-2" />
              <span>User Management</span>
            </div>
            <div
              onClick={handleBeneficiaryManagement}
              className="bg-gradient-to-r from-teal-700 to-teal-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <FaHandHoldingHeart className="mr-2" />
              <span>Beneficiary Management</span>
            </div>
            <div
              onClick={handlePaymentRequests}
              className="bg-gradient-to-r from-amber-700 to-amber-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <FaMoneyCheckAlt className="mr-2" />
              <span>Payment Requests</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;