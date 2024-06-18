// src/Views/Shared/UserPaymentRequestHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../secrets";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const UserPaymentRequestHistory = () => {
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [filteredPaymentRequests, setFilteredPaymentRequests] = useState([]);
    const [expandedRequests, setExpandedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        fetchPaymentRequests();
    }, []);

    useEffect(() => {
        filterPaymentRequests();
    }, [searchTerm, paymentRequests]);

    const fetchPaymentRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/v1/shared/myPaymentRequests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPaymentRequests(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payment requests:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setLoading(false);
        }
    };

    const filterPaymentRequests = () => {
        const filtered = paymentRequests.filter((request) =>
            Object.values(request).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredPaymentRequests(filtered);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }

        const sorted = [...filteredPaymentRequests].sort((a, b) => {
            if (a[column] < b[column]) return sortOrder === "asc" ? -1 : 1;
            if (a[column] > b[column]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        setFilteredPaymentRequests(sorted);
    };

    const toggleRequestExpansion = (requestId) => {
        if (expandedRequests.includes(requestId)) {
            setExpandedRequests(expandedRequests.filter((id) => id !== requestId));
        } else {
            setExpandedRequests([...expandedRequests, requestId]);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                    <div className="container mx-auto px-4 py-2">
                        <h2 className="text-2xl font-bold mb-4">Payment Request History</h2>
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {loading ? (
                                <div className="text-center py-4">
                                    <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                    <span className="text-gray-500">Loading payment request history...</span>
                                </div>
                            ) : filteredPaymentRequests.length === 0 ? (
                                <div className="text-center text-gray-500 py-4">No payment request history found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("accountHolderName")}>
                                                    Name {sortColumn === "accountHolderName" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("paymentMadeFor")}>
                                                    Payment Made For {sortColumn === "paymentMadeFor" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("paymentMethod")}>
                                                    Payment Method {sortColumn === "paymentMethod" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("amount")}>
                                                    Amount {sortColumn === "amount" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("status")}>
                                                    Status {sortColumn === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredPaymentRequests.map((request) => (
                                                <React.Fragment key={request._id}>
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap">{request.accountHolderName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{request.paymentMadeFor}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{request.paymentMethod}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{request.amount}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'Completed' ? 'bg-green-100 text-green-800' : request.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {request.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => toggleRequestExpansion(request._id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                {expandedRequests.includes(request._id) ? <FaChevronUp /> : <FaChevronDown />}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedRequests.includes(request._id) && (
                                                        <tr>
                                                            <td colSpan="6" className="px-6 py-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <p><strong>ID:</strong> {request._id}</p>
                                                                        <p><strong>UPI Number:</strong> {request.upiNumber}</p>
                                                                        <p><strong>Beneficiary:</strong> {request.beneficiary}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p><strong>CFO Approval:</strong> {request.CFOApproval}</p>
                                                                        <p><strong>CMO Approval:</strong> {request.CMOApproval}</p>
                                                                        <p><strong>CEO Approval:</strong> {request.CEOApproval}</p>
                                                                        <p><strong>Created At:</strong> {request.createdAt}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserPaymentRequestHistory;