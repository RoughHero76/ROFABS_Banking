// src/Views/Shared/AddBeneficiary.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { toast } from "react-toastify";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { motion } from "framer-motion";

const AddBeneficiary = () => {
    const [formData, setFormData] = useState({
        name: "",
        accountNumber: "",
        phoneNumber: "",
        ifscCode: "",
        type: "",
    });
    const [formLoading, setFormLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addBeneficiary = async () => {
        try {
            setFormLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/api/v1/shared/addBeneficiary`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                name: "",
                accountNumber: "",
                phoneNumber: "",
                ifscCode: "",
                type: "",
            });
            setFormLoading(false);
            toast.success(response?.data?.message || "Beneficiary added successfully");
        } catch (error) {
            console.error("Error adding beneficiary:", error);
            setFormLoading(false);
            toast.error(error.response?.data?.message || "An error occurred");
        }
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
                        <div className="container mx-auto px-4 py-2">
                            <h2 className="text-2xl font-bold mb-4">Add Beneficiary</h2>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleInputChange}
                                        placeholder="Account Number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={handleInputChange}
                                        placeholder="IFSC Code"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>
                                            Select Type
                                        </option>
                                        <option value="Vendor">Vendor</option>
                                        <option value="Employee">Employee</option>
                                        <option value="Director">Director</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={addBeneficiary}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                        disabled={formLoading}
                                    >
                                        {formLoading ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Loading...
                                            </span>
                                        ) : (
                                            "Add Beneficiary"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AddBeneficiary;
