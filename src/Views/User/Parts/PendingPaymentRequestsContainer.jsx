// src/Views/Shared/PendingPaymentRequestsContainer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp, FaCheck, FaTimes } from "react-icons/fa";
import { motion } from 'framer-motion';

const PendingPaymentRequestsContainer = ({ countOfPendingRequests }) => {
    const [paymentRequests, setPendingPaymentRequests] = useState([]);

    const [expandedRequests, setExpandedRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/v1/shared/getPendingRequests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPendingPaymentRequests(response.data.data);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setLoading(false);
        }
    };

    const updateApprovalStatus = async (paymentRequestId, approvalStatus) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/api/v1/shared/updateApprovalPayment`,
                { paymentRequestId, approvalStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === 'success') {
                fetchPendingRequests();
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating approval status:", error);
            if (error.response) {
                toast.error(error.response.data.message || "An error occurred");
            } else {
                toast.error("An error occurred");
            }
        }
    };

    const toggleRequestExpansion = (requestId) => {
        if (expandedRequests.includes(requestId)) {
            setExpandedRequests(expandedRequests.filter((id) => id !== requestId));
        } else {
            setExpandedRequests([...expandedRequests, requestId]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="bg-white shadow-md rounded-lg p-6 mt-6"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-4">Payment Requests</h2>
                <div className="bg-red-100 text-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {countOfPendingRequests}
                </div>
            </div>
            {loading ? (
                <div className="text-center py-8">
                    <BeatLoader color="#3B82F6" loading={loading} size={12} />
                    <span className="text-gray-500 mt-2">Loading payment requests...</span>
                </div>
            ) : paymentRequests.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No payment requests found.</div>
            ) : (
                <div className="max-h-96 overflow-y-auto no-scrollbar">
                    <ul className="space-y-6">
                        {paymentRequests.map((request) => (
                            <li key={request._id} className="border border-gray-200 rounded-lg shadow-sm">
                                <div
                                    className="flex items-center justify-between cursor-pointer bg-gray-50 p-4 rounded-t-lg"
                                    onClick={() => toggleRequestExpansion(request._id)}
                                >
                                    <div>
                                        <span className="font-bold text-lg">Amount: {request.amount}</span>
                                        <span className="ml-4 text-gray-600">Payment Made For: {request.paymentMadeFor}</span>
                                    </div>
                                    <div className="text-gray-500">
                                        {expandedRequests.includes(request._id) ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                </div>
                                {expandedRequests.includes(request._id) && (
                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-bold">Payment Made For:</span> {request.paymentMadeFor || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">Payment Method:</span> {request.paymentMethod || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">Account Holder Name:</span> {request.accountHolderName || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">Account Number:</span> {request.accountNumber || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">IFSC Code:</span> {request.ifscCode || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">UPI Number:</span> {request.upiNumber || "Not Available"}
                                            </div>
                                        </div>
                                        <div className="flex space-x-4 items-center">
                                            <span className="font-bold">Status:</span>
                                            <span className={`px-2 py-1 rounded-md text-white ${request.status === 'Completed' ? 'bg-green-500' : request.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                                {request.status || "Not Available"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <span className="font-bold">CFO Approval:</span> {request.CFOApproval}
                                            </div>
                                            <div>
                                                <span className="font-bold">CMO Approval:</span> {request.CMOApproval}
                                            </div>
                                            <div>
                                                <span className="font-bold">CEO Approval:</span> {request.CEOApproval}
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={() => updateApprovalStatus(request._id, "Approved")}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
                                            >
                                                <FaCheck className="mr-2" /> Approve
                                            </button>
                                            <button
                                                onClick={() => updateApprovalStatus(request._id, "Rejected")}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center"
                                            >
                                                <FaTimes className="mr-2" /> Reject
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

export default PendingPaymentRequestsContainer;