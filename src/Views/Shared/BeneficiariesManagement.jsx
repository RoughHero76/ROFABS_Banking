// src/Views/Shared/BeneficiariesManagement.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { FaUserPlus, FaListAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const BeneficiariesManagement = () => {

    const navigate = useNavigate();

    const handleAddBeneficiary = () => {
        navigate("/addBeneficiary");
    };

    const handleViewBeneficiaries = () => {
        navigate("/viewBeneficiaries");
    };

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            onClick={handleAddBeneficiary}
                            className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center">
                                    <FaUserPlus className="mr-4 text-white text-2xl" />
                                    <span className="text-white font-bold text-lg">Add Beneficiary</span>
                                </div>
                                <div className="bg-white text-purple-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                    <FaUserPlus />
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-white">Add new beneficiaries to the system.</p>
                            </div>
                        </div>

                        <div
                            onClick={handleViewBeneficiaries}
                            className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center">
                                    <FaListAlt className="mr-4 text-white text-2xl" />
                                    <span className="text-white font-bold text-lg">View Beneficiaries</span>
                                </div>
                                <div className="bg-white text-teal-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                    <FaListAlt />
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-white">View and manage existing beneficiaries.</p>
                            </div>
                        </div>
                    </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default BeneficiariesManagement;
