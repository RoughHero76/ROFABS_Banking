import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPageFirst from './components/LoginPageFirst';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './Views/Admin/Parts/UserManagement';
import BeneficiariesManagement from './Views/Shared/BeneficiariesManagement';
import MakePaymentRequests from './Views/Shared/MakePaymentRequests';
import PaymentRequests from './Views/Admin/Parts/PaymentRequests';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPageFirst />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/beneficiariesManagement" element={<BeneficiariesManagement />} />
        <Route path="/makePaymentRequests" element={<MakePaymentRequests />} />
        <Route path="/paymentRequests" element={<PaymentRequests />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;