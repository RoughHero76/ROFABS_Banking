// src/Views/Admin/Parts/PaymentRequests.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const PaymentRequests = () => {
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [requesters, setRequesters] = useState({});
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
            setPaymentRequests(response.data.data);
            await fetchRequesters(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setLoading(false);
        }
    };

    const fetchRequesters = async (requests) => {
        const uids = requests.map((request) => request.PaymentRequestMadeBy);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/v1/admin/getUsers?uids=${uids.join(",")}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const requestersData = response.data.data.reduce((obj, user) => {
            obj[user.uid] = user.name;
            return obj;
        }, {});
        setRequesters(requestersData);
    };

    const updatePaymentStatus = async (paymentId, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/api/v1/admin/updatePaymentStatus/${status}`,
                { paymentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPendingRequests();
            toast.success(`Payment status updated to ${status}`);
        } catch (error) {
            console.error("Error updating payment status:", error);
            toast.error(error.response?.data?.message || "An error occurred");
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
                        <h2 className="text-2xl font-bold mb-4">Payment Requests</h2>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            {loading ? (
                                <div className="text-center">
                                    <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                    <span className="text-gray-500">Loading payment requests...</span>
                                </div>
                            ) : paymentRequests.length === 0 ? (
                                <div className="text-center text-gray-500">No payment requests found.</div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto no-scrollbar">
                                    <ul className="space-y-6">
                                        {paymentRequests.map((request) => (
                                            <li key={request._id} className="border border-gray-200 rounded-lg p-4">
                                                <div
                                                    className="flex items-center justify-between cursor-pointer bg-gray-100 p-2 rounded-lg"
                                                    onClick={() => toggleRequestExpansion(request._id)}
                                                >
                                                    <div>
                                                        <span className="font-bold text-lg">Amount: {request.amount}</span>
                                                        <span className="ml-4 text-gray-600">Requester: {requesters[request.PaymentRequestMadeBy]}</span>
                                                    </div>
                                                    <div>
                                                        {expandedRequests.includes(request._id) ? <FaChevronUp /> : <FaChevronDown />}
                                                    </div>
                                                </div>
                                                {expandedRequests.includes(request._id) && (
                                                    <div className="mt-4 space-y-2">
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
                                                        <div>
                                                            <span className="font-bold">Status:</span> {request.status || "Not Available"}
                                                        </div>
                                                        <div className="mt-4">
                                                            <div>
                                                                <span className="font-bold">CFO Approved:</span> {request.CFOApproved ? "Yes" : "No"}
                                                            </div>
                                                            <div>
                                                                <span className="font-bold">CMO Approved:</span> {request.CMOApproved ? "Yes" : "No"}
                                                            </div>
                                                            <div>
                                                                <span className="font-bold">CEO Approved:</span> {request.CEOApproved ? "Yes" : "No"}
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-4 mt-6">
                                                            <button
                                                                onClick={() => updatePaymentStatus(request._id, "Completed")}
                                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                                            >
                                                                Complete
                                                            </button>
                                                            <button
                                                                onClick={() => updatePaymentStatus(request._id, "Rejected")}
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

export default PaymentRequests;