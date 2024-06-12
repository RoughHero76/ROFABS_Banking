// src/Views/Shared/PendingPaymentRequests.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../secrets";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const PendingPaymentRequests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [expandedRequests, setExpandedRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPendingRequests = async () => {
            const pendingRequests = await fetchPendingRequests();
            setPendingRequests(pendingRequests);
        };
        getPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/v1/shared/getPendingRequests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoading(false);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "An error occurred while fetching pending requests");
            return [];
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
                const updatedRequests = await fetchPendingRequests();

                if (updatedRequests.length === 0) {
                    setPendingRequests([]);
                    toast.success("No pending requests found");
                } else {
                    setPendingRequests(updatedRequests);
                    toast.success(response.data.message);
                }
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
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-6 flex-1">
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold mb-4">Pending Payment Requests</h2>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            {loading ? (
                                <div className="text-center">
                                    <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                    <span className="text-gray-500">Loading pending requests...</span>
                                </div>
                            ) : pendingRequests.length === 0 ? (
                                <div className="text-center text-gray-500">No pending requests found.</div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto no-scrollbar">
                                    <ul className="space-y-6">
                                        {pendingRequests.map((request) => (
                                            <li key={request._id} className="border border-gray-200 rounded-lg p-4">
                                                <div
                                                    className="flex items-center justify-between cursor-pointer bg-gray-100 p-2 rounded-lg"
                                                    onClick={() => toggleRequestExpansion(request._id)}
                                                >
                                                    <div>
                                                        <span className="font-bold text-lg">Amount: {request.amount}</span>
                                                        <span className="ml-4 text-gray-600">Payment Made For: {request.paymentMadeFor}</span>
                                                    </div>
                                                    <div>
                                                        {expandedRequests.includes(request._id) ? <FaChevronUp /> : <FaChevronDown />}
                                                    </div>
                                                </div>
                                                {expandedRequests.includes(request._id) && (
                                                    <div className="mt-4 space-y-2">
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
                                                        <div className="mt-4 space-y-2">
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
                                                        <div className="mt-4 space-x-4">
                                                            <button
                                                                onClick={() => updateApprovalStatus(request._id, "Approved")}
                                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateApprovalStatus(request._id, "Rejected")}
                                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PendingPaymentRequests;