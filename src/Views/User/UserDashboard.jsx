// src/views/User/UserDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHandHoldingHeart, FaMoneyCheckAlt } from 'react-icons/fa';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { BeatLoader } from "react-spinners";
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../../secrets';
import { motion } from 'framer-motion';
import PendingPaymentRequestsContainer from './Parts/PendingPaymentRequestsContainer';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [designation, setDesignation] = useState('');
  const [token, setToken] = useState('');
  const [countOfPendingRequests, setCountOfPendingRequests] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedDesignation = localStorage.getItem('designation');
    setDesignation(storedDesignation);

    if (!storedToken) {
      navigate('/login');
    } else {
      setToken(storedToken);
      //console.log(storedToken);
    }
  }, [navigate]);

  useEffect(() => {
    if (token && designation !== 'Employee') {
      fetchCountOfPendingRequests();
    }
  }, [token, designation]);

  const fetchCountOfPendingRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/shared/getCountOfPendingRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const count = response.data.data;
      setCountOfPendingRequests(count);
    } catch (error) {
      console.error("Error fetching count of pending requests:", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching count of pending requests");
    }
  };

  const handleBeneficiaryManagement = () => {
    navigate('/beneficiariesManagement');
  };

  const handleMakePaymentRequest = () => {
    navigate('/makePaymentRequests');
  };

  const UserPaymentRequestHistory = () => {
    navigate('/paymentRequestHistory');
  };

  if (!designation) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6 flex-1">
            <div className="flex min-h-screen bg-gray-100 justify-center align-middle">
              <BeatLoader color="#36d7b7" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isEmployee = designation === 'Employee';

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={handleBeneficiaryManagement}
                className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <FaHandHoldingHeart className="mr-4 text-white text-2xl" />
                    <span className="text-white font-bold text-lg">Beneficiary Management</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white">Manage beneficiaries, view their details, and track their progress.</p>
                </div>
              </div>

              {!isEmployee && (
                <div
                  onClick={handleMakePaymentRequest}
                  className="bg-gradient-to-r from-amber-700 to-amber-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center">
                      <FaMoneyCheckAlt className="mr-4 text-white text-2xl" />
                      <span className="text-white font-bold text-lg">Make Payment</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-white">Submit payment requests for beneficiaries.</p>
                  </div>
                </div>
              )}

              {!isEmployee && (
                <div
                  onClick={UserPaymentRequestHistory}
                  className="bg-gradient-to-r from-red-700 to-red-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center">
                      <FaMoneyCheckAlt className="mr-4 text-white text-2xl" />
                      <span className="text-white font-bold text-lg">Payment History</span>
                    </div>

                  </div>
                  <div className="p-6">
                    <p className="text-white">View and manage pending payment requests.</p>
                  </div>
                </div>
              )}
            </div>

            {!isEmployee && (
              <div className="mt-8">

                {/*  <PaymentRequestsContainer /> */}
                <PendingPaymentRequestsContainer 
                countOfPendingRequests={countOfPendingRequests}
                
                /> 
              </div>
            )}

            {/* <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-6">
                <PendingPaymentRequestsContainer />
              </div>

            </div> */}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;