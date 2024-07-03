// src/Views/Admin/Parts/AddPaymentHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import Select from "react-select";

const AddPaymentHistory = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
    const [formData, setFormData] = useState({
        paymentMadeFor: "",
        paymentMethod: "",
        upiNumber: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        amount: "",
    });
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    //Payment Methods
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        fetchBeneficiaries();
        fetchPaymentMethods();
    }, []);

    const fetchBeneficiaries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/v1/shared/getBeneficiaries`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBeneficiaries(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching beneficiaries:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Error, Couldn't Fetch Beneficiaries");
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/v1/shared/paymentMethods`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPaymentMethods(response.data.paymentMethods);
        } catch (error) {
            console.error("Error fetching payment methods:", error);
            toast.error(error.response?.data?.message || "Error, Couldn't Fetch Payment Methods");
        }
    };

    const makePaymentRequest = async () => {
        try {
            setFormLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/api/v1/admin/addPaymentHistory`,
                { ...formData, beneficiaryId: selectedBeneficiary?._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFormData({
                paymentMadeFor: "",
                paymentMethod: "",
                upiNumber: "",
                accountNumber: "",
                ifscCode: "",
                accountHolderName: "",
                amount: "",
            });
            setSelectedBeneficiary(null);
            setFormLoading(false);
            toast.success(response?.data?.message || "Payment request created successfully");
        } catch (error) {
            console.error("Error making payment request:", error);
            setFormLoading(false);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBeneficiaryChange = (selectedOption) => {
        setSelectedBeneficiary(selectedOption);
        if (selectedOption) {
            const { accountNumber, ifscCode, name } = selectedOption;
            setFormData({
                ...formData,
                accountNumber,
                ifscCode,
                accountHolderName: name,
            });
        } else {
            setFormData({
                ...formData,
                accountNumber: "",
                ifscCode: "",
                accountHolderName: "",
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-2 flex-1">
                    <div className="container mx-auto px-4 py-2">
                        <div className="bg-white shadow-lg rounded-lg p-8">
                            <h2 className="text-2xl font-bold mb-6">Add Payment History</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="paymentMadeFor" className="block mb-2 font-semibold">
                                        Payment Made For
                                    </label>
                                    <select
                                        id="paymentMadeFor"
                                        name="paymentMadeFor"
                                        value={formData.paymentMadeFor}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled>
                                            Select Payment Made For
                                        </option>
                                        <option value="Salaries">Salaries</option>
                                        <option value="Vendors">Vendors</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="beneficiary" className="block mb-2 font-semibold">
                                        Beneficiary
                                    </label>
                                    {loading ? (
                                        <div className="text-center">
                                            <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                            <span className="text-gray-500">Loading beneficiaries...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            id="beneficiary"
                                            options={beneficiaries}
                                            getOptionLabel={(beneficiary) => beneficiary.name}
                                            getOptionValue={(beneficiary) => beneficiary._id}
                                            value={selectedBeneficiary}
                                            onChange={handleBeneficiaryChange}
                                            placeholder="Select Beneficiary"
                                            className="w-full"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="paymentMethod" className="block mb-2 font-semibold">
                                        Payment Method
                                    </label>
                                    <select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled>
                                            Select Payment Method
                                        </option>
                                        {paymentMethods.map((method) => (
                                            <option key={method} value={method}>
                                                {method}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {formData.paymentMethod === "UPI" && (
                                    <div>
                                        <label htmlFor="upiNumber" className="block mb-2 font-semibold">
                                            UPI ID
                                        </label>
                                        <input
                                            type="text"
                                            id="upiNumber"
                                            name="upiNumber"
                                            value={formData.upiNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter UPI ID"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}
                                {formData.paymentMethod !== "UPI" && (
                                    <>
                                        <div>
                                            <label htmlFor="accountNumber" className="block mb-2 font-semibold">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                id="accountNumber"
                                                name="accountNumber"
                                                value={formData.accountNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter Account Number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                readOnly={selectedBeneficiary !== null}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="ifscCode" className="block mb-2 font-semibold">
                                                IFSC Code
                                            </label>
                                            <input
                                                type="text"
                                                id="ifscCode"
                                                name="ifscCode"
                                                value={formData.ifscCode}
                                                onChange={handleInputChange}
                                                placeholder="Enter IFSC Code"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                readOnly={selectedBeneficiary !== null}
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label htmlFor="accountHolderName" className="block mb-2 font-semibold">
                                        Account Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        id="accountHolderName"
                                        name="accountHolderName"
                                        value={formData.accountHolderName}
                                        onChange={handleInputChange}
                                        placeholder="Enter Account Holder Name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        readOnly={selectedBeneficiary !== null}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="amount" className="block mb-2 font-semibold">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        placeholder="Enter Amount"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-8">
                                <button
                                    onClick={makePaymentRequest}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                                        "Add Payment"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddPaymentHistory;