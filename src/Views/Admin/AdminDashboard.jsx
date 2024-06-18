// src/views/Admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHandHoldingHeart, FaMoneyCheckAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../../secrets';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { motion } from 'framer-motion';
import PendingPaymentRequestsContainer from './Parts/PendingPaymentRequestsContainer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [designation, setDesignation] = useState('');
  const [token, setToken] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [beneficiaryCount, setBeneficiaryCount] = useState(0);
  const [paymentRequestsCount, setPaymentRequestsCount] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedDesignation = localStorage.getItem('designation');
    setDesignation(storedDesignation);
    if (!storedToken) {
      navigate('/login');
    } else {
      setToken(storedToken);
      fetchCounts(storedToken);
      console.log(storedToken);
    }
  }, [navigate]);

  const fetchCounts = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/admin/getCount`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data.data;

      if (response.data.status === 'success') {
        setUserCount(data.userCount);
        setBeneficiaryCount(data.beneficiaryCount);
        setPaymentRequestsCount(data.paymentRequestCount);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleUserManagement = () => {
    navigate('/userManagement');
  };

  const handleBeneficiaryManagement = () => {
    navigate('/beneficiariesManagement');
  };

  const handlePaymentHistory = () => {
    navigate('/paymentHistory');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div
                onClick={handleUserManagement}
                className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <FaUsers className="mr-4 text-white text-2xl" />
                    <span className="text-white font-bold text-lg">Users</span>
                  </div>
                  <div className="bg-white text-purple-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {userCount}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white">Manage users, assign roles, and view user details.</p>
                </div>
              </div>

              <div
                onClick={handleBeneficiaryManagement}
                className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <FaHandHoldingHeart className="mr-4 text-white text-2xl" />
                    <span className="text-white font-bold text-lg">Beneficiaries</span>
                  </div>
                  <div className="bg-white text-teal-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {beneficiaryCount}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white">Manage beneficiaries, view their details, and track their progress.</p>
                </div>
              </div>

              <div
                onClick={handlePaymentHistory}
                className="bg-gradient-to-r from-amber-700 to-amber-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <FaMoneyCheckAlt className="mr-4 text-white text-2xl" />
                    <span className="text-white font-bold text-lg">Payment History</span>
                  </div>
                  <div className="bg-white text-amber-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {paymentRequestsCount}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white">View and process payment requests for beneficiaries.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-6">
                <PendingPaymentRequestsContainer />
              </div>

            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;