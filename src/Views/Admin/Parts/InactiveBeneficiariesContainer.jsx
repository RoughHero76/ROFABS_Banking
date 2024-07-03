import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp, FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const InactiveBeneficiaries = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [expandedBeneficiaries, setExpandedBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const fetchBeneficiaries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/v1/shared/getBeneficiaries?status=Inactive`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBeneficiaries(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching beneficiaries:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setLoading(false);
        }
    };

    const handleToggleBeneficiaryStatus = async (beneficiary) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/api/v1/admin/toggleBeneficiaryStatus`,
                { accountNumber: beneficiary.accountNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchBeneficiaries();
            toast.success(response?.data?.message || "Beneficiary status toggled successfully");
        } catch (error) {
            console.error("Error toggling beneficiary status:", error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const toggleBeneficiaryExpansion = (beneficiaryId) => {
        if (expandedBeneficiaries.includes(beneficiaryId)) {
            setExpandedBeneficiaries(expandedBeneficiaries.filter((id) => id !== beneficiaryId));
        } else {
            setExpandedBeneficiaries([...expandedBeneficiaries, beneficiaryId]);
        }
    };

    const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
        const matchesSearchTerm = beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearchTerm;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="bg-white shadow-md rounded-lg p-6 mt-6"
        >
            <h2 className="text-2xl font-bold mb-4">Inactive Beneficiaries</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by beneficiary name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
            </div>
            {loading ? (
                <div className="text-center py-8">
                    <BeatLoader color="#3B82F6" loading={loading} size={12} />
                    <span className="text-gray-500 mt-2">Loading beneficiaries...</span>
                </div>
            ) : filteredBeneficiaries.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No inactive beneficiaries found.</div>
            ) : (
                <div className="max-h-96 overflow-y-auto no-scrollbar">
                    <ul className="space-y-6">
                        {filteredBeneficiaries.map((beneficiary) => (
                            <li key={beneficiary._id} className="border border-gray-200 rounded-lg shadow-sm">
                                <div
                                    className="flex flex-col sm:flex-row items-center justify-between cursor-pointer bg-gray-50 p-4 rounded-t-lg"
                                    onClick={() => toggleBeneficiaryExpansion(beneficiary._id)}
                                >
                                    <div className="flex-1">
                                        <span className="font-bold text-lg text-blue-600">Name: {beneficiary.name}</span>
                                        <div className="mt-2 sm:mt-0 text-gray-600">Account Number: {beneficiary.accountNumber}</div>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                                        <span className="text-gray-500">
                                            {expandedBeneficiaries.includes(beneficiary._id) ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    </div>
                                </div>
                                {expandedBeneficiaries.includes(beneficiary._id) && (
                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-bold">Phone Number:</span> {beneficiary.phoneNumber || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">IFSC Code:</span> {beneficiary.ifscCode || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">Added By:</span> {beneficiary.AddedBy || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">Branch:</span> {beneficiary.branch || "Not Available"}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleToggleBeneficiaryStatus(beneficiary)}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
                                            >
                                                <FaCheck className="mr-2" /> Activate
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

export default InactiveBeneficiaries;