// src/views/User/UserDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHandHoldingHeart, FaMoneyCheckAlt } from 'react-icons/fa';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PaymentRequestsContainer from '../Shared/PaymentRequestsContainer';
import { BeatLoader } from "react-spinners";

const UserDashboard = () => {
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
  }, [navigate]);

  const handleBeneficiaryManagement = () => {
    navigate('/beneficiariesManagement');
  };

  const handleMakePaymentRequest = () => {
    navigate('/makePaymentRequests');
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
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <button
              onClick={handleBeneficiaryManagement}
              className="bg-teal-500 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
            >
              <FaHandHoldingHeart className="mr-2" />
              Beneficiary Management
            </button>

            {!isEmployee && (
              <button
                onClick={handleMakePaymentRequest}
                className="bg-amber-500 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
              >
                <FaMoneyCheckAlt className="mr-2" />
                Make Payment Requests
              </button>
            )}
          </div>

          {!isEmployee &&
            <div className="mt-8">
              <PaymentRequestsContainer />
            </div>
          }

        </main>
      </div>
    </div>
  );
};

export default UserDashboard;