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
import PendingPaymentRequests from './Views/Shared/PendingPaymentRequests';
import Profile from './Views/Shared/Profile';

//BeneficiariesManagement
import AddBeneficiary from './Views/Shared/Beneficiaries/AddBeneficiary';
import ViewBeneficiaries from './Views/Shared/Beneficiaries/ViewBeneficiaries';

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
        <Route path="/pendingPaymentRequests" element={<PendingPaymentRequests />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/addBeneficiary" element={<AddBeneficiary />} />
        <Route path="/viewBeneficiaries" element={<ViewBeneficiaries />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;