import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp, FaCheck, FaTimes, FaClock, FaThumbsUp } from "react-icons/fa";
import { motion } from 'framer-motion';

const PendingPaymentRequests = () => {
    const [paymentRequests, setPendingPaymentRequests] = useState([]);
    const [requesterNames, setRequesterNames] = useState({});
    const [expandedRequests, setExpandedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentMadeForFilter, setPaymentMadeForFilter] = useState("");

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
            await fetchRequesterNames(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setLoading(false);
        }
    };

    const fetchRequesterNames = async (paymentRequests) => {
        const uids = paymentRequests.map((paymentRequest) => paymentRequest.PaymentRequestMadeBy);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/v1/admin/getUsers?uids=${uids.join(",")}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const requesterNamesData = response.data.data.reduce((obj, user) => {
            obj[user.uid] = user.name;
            return obj;
        }, {});
        setRequesterNames(requesterNamesData);
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <FaCheck className="text-green-500" />;
            case 'Rejected':
                return <FaTimes className="text-red-500" />;
            case 'Pending':
                return <FaClock className="text-yellow-500" />;
            case 'Approved':
                return <FaThumbsUp className="text-blue-500" />;
            default:
                return null;
        }
    };

    const filteredPaymentRequests = paymentRequests.filter((paymentRequest) => {
        const requesterName = requesterNames[paymentRequest.PaymentRequestMadeBy] || "";
        const matchesSearchTerm = requesterName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPaymentMadeFor = paymentMadeForFilter === "" || paymentRequest.paymentMadeFor === paymentMadeForFilter;
        return matchesSearchTerm && matchesPaymentMadeFor;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="bg-white shadow-md rounded-lg p-6 mt-6"
        >
            <h2 className="text-2xl font-bold mb-4">Payment Requests</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by requester name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 mr-4"
                />
                <select
                    value={paymentMadeForFilter}
                    onChange={(e) => setPaymentMadeForFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2"
                >
                    <option value="">All</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Vendors">Vendors</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            {loading ? (
                <div className="text-center py-8">
                    <BeatLoader color="#3B82F6" loading={loading} size={12} />
                    <span className="text-gray-500 mt-2">Loading payment requests...</span>
                </div>
            ) : filteredPaymentRequests.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No payment requests found.</div>
            ) : (
                <div className="max-h-96 overflow-y-auto no-scrollbar">
                    <ul className="space-y-6">
                        {filteredPaymentRequests.map((paymentRequest) => (
                            <li key={paymentRequest._id} className="border border-gray-200 rounded-lg shadow-sm">
                                <div
                                    className="flex flex-col sm:flex-row items-center justify-between cursor-pointer bg-gray-50 p-4 rounded-t-lg"
                                    onClick={() => toggleRequestExpansion(paymentRequest._id)}
                                >
                                    <div className="flex-1">
                                        <span className="font-bold text-lg text-blue-600">Amount: {paymentRequest.amount}</span>
                                        <div className="mt-2 sm:mt-0 text-gray-600">Requester: {requesterNames[paymentRequest.PaymentRequestMadeBy]}</div>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                                        <span>{getStatusIcon(paymentRequest.status)}</span>
                                        <span className="text-gray-500">
                                            {expandedRequests.includes(paymentRequest._id) ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    </div>
                                </div>
                                {expandedRequests.includes(paymentRequest._id) && (
                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-bold">Payment Made For:</span> {paymentRequest.paymentMadeFor || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">Payment Method:</span> {paymentRequest.paymentMethod || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">Account Holder Name:</span> {paymentRequest.accountHolderName || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">Account Number:</span> {paymentRequest.accountNumber || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">IFSC Code:</span> {paymentRequest.ifscCode || "Not Available"}
                                            </div>
                                            <div>
                                                <span className="font-bold">UPI Number:</span> {paymentRequest.upiNumber || "Not Available"}
                                            </div>
                                        </div>
                                        <div className="flex space-x-4 items-center">
                                            <span className="font-bold">Status:</span>
                                            <span className={`px-2 py-1 rounded-md text-white ${paymentRequest.status === 'Completed' ? 'bg-green-500' : paymentRequest.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                                {paymentRequest.status || "Not Available"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">CEO Approval:</span>
                                                {paymentRequest.CEOApproval === 'Approved' ? (
                                                    <FaThumbsUp className="text-blue-500" />
                                                ) : paymentRequest.CEOApproval === 'Pending' ? (
                                                    <FaClock className="text-yellow-500" />
                                                ) : null}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">COO Approval:</span>
                                                {paymentRequest.COOApproval === 'Approved' ? (
                                                    <FaThumbsUp className="text-blue-500" />
                                                ) : paymentRequest.COOApproval === 'Pending' ? (
                                                    <FaClock className="text-yellow-500" />
                                                ) : null}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">MD Approval:</span>
                                                {paymentRequest.MDApproval === 'Approved' ? (
                                                    <FaThumbsUp className="text-blue-500" />
                                                ) : paymentRequest.MDApproval === 'Pending' ? (
                                                    <FaClock className="text-yellow-500" />
                                                ) : null}
                                            </div>

                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                                            <button
                                                onClick={() => updatePaymentStatus(paymentRequest._id, "Completed")}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
                                            >
                                                <FaCheck className="mr-2" /> Complete
                                            </button>
                                            <button
                                                onClick={() => updatePaymentStatus(paymentRequest._id, "Rejected")}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
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

export default PendingPaymentRequests;