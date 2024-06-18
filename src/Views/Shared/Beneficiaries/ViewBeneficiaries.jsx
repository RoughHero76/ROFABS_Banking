// src/Views/Shared/ViewBeneficiaries.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import Alert from "../../../components/Alert";
import { motion } from 'framer-motion';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

const ViewBeneficiaries = () => {
    const userDesignation = localStorage.getItem("designation");

    const [searchQuery, setSearchQuery] = useState("");
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
        const { name, phoneNumber, accountNumber } = beneficiary;
        const query = searchQuery.toLowerCase();
        return (
            name.toLowerCase().includes(query) ||
            phoneNumber.toLowerCase().includes(query) ||
            accountNumber.toLowerCase().includes(query)
        );
    });

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
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const handleToggleBeneficiaryStatus = async (beneficiary) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/api/v1/admin/toggleBeneficiaryStatus`,
                { accountNumber: beneficiary.accountNumber },
                { headers: { Authorization: `Bearer ${token}` } });
            await fetchBeneficiaries();
            toast.success(response?.data?.message || "Beneficiary status toggled successfully");
        } catch (error) {
            console.error("Error toggling beneficiary status:", error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const deleteBeneficiary = (beneficiary) => {
        setBeneficiaryToDelete(beneficiary);
        setShowAlert(true);
    };

    const confirmDeleteBeneficiary = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/api/v1/shared/deleteBeneficiary`,
                { objectId: beneficiaryToDelete._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBeneficiaries();
            setLoading(false);
            setShowAlert(false);
            setBeneficiaryToDelete(null);
            toast.success(response?.data?.message || "Beneficiary deleted successfully");
        } catch (error) {
            console.error("Error deleting beneficiary:", error);
            setLoading(false);
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
                            <h2 className="text-2xl font-bold mb-4">Beneficiaries</h2>
                            <input
                                type="text"
                                placeholder="Search by name, phone number, or account number"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            {loading ? (
                                <div className="text-center">
                                    <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                    <span className="text-gray-500">Loading beneficiaries...</span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead>
                                            <tr className="bg-gray-100 text-left text-gray-600">
                                                <th className="py-2 px-4 border-b">Name</th>
                                                <th className="py-2 px-4 border-b">Account Number</th>
                                                <th className="py-2 px-4 border-b">Phone Number</th>
                                                <th className="py-2 px-4 border-b">IFSC Code</th>
                                                <th className="py-2 px-4 border-b">Type</th>
                                                <th className="py-2 px-4 border-b">Status</th>
                                                <th className="py-2 px-4 border-b">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBeneficiaries.map((beneficiary) => (
                                                <tr key={beneficiary._id} className="hover:bg-gray-50">
                                                    <td className="py-2 px-4 border-b">{beneficiary.name}</td>
                                                    <td className="py-2 px-4 border-b">{beneficiary.accountNumber}</td>
                                                    <td className="py-2 px-4 border-b">{beneficiary.phoneNumber}</td>
                                                    <td className="py-2 px-4 border-b">{beneficiary.ifscCode}</td>
                                                    <td className="py-2 px-4 border-b">{beneficiary.type}</td>
                                                    <td className="py-2 px-4 border-b">{beneficiary.status} {beneficiary.status !== "Active" && <span className="text-gray-500 ml-3">Please Ask Admin To Activate It</span>}</td>
                                                    <td className="py-2 px-4 border-b flex space-x-2">
                                                        <button
                                                            onClick={() => deleteBeneficiary(beneficiary)}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                        {userDesignation === "Director" && (
                                                            <button
                                                                onClick={() => handleToggleBeneficiaryStatus(beneficiary)}
                                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                                            >
                                                                Toggle Status
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {showAlert && (
                                <Alert
                                    message={`Are you sure you want to delete ${beneficiaryToDelete.name}?`}
                                    onConfirm={confirmDeleteBeneficiary}
                                    onCancel={() => setShowAlert(false)}
                                />
                            )}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default ViewBeneficiaries;
