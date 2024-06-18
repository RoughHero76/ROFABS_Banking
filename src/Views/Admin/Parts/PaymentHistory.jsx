// src/Views/Admin/Parts/PaymentHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    useEffect(() => {
        filterPaymentHistory();
    }, [searchTerm, paymentHistory]);

    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/v1/admin/getPaymentHistory`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPaymentHistory(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payment history:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setLoading(false);
        }
    };

    const filterPaymentHistory = () => {
        const filtered = paymentHistory.filter((payment) =>
            Object.values(payment).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredPaymentHistory(filtered);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }

        const sorted = [...filteredPaymentHistory].sort((a, b) => {
            if (a[column] < b[column]) return sortOrder === "asc" ? -1 : 1;
            if (a[column] > b[column]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        setFilteredPaymentHistory(sorted);
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
                        <h2 className="text-2xl font-bold mb-4">Payment History</h2>
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
                                    <span className="text-gray-500">Loading payment history...</span>
                                </div>
                            ) : filteredPaymentHistory.length === 0 ? (
                                <div className="text-center text-gray-500 py-4">No payment history found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("_id")}>
                                                    ID {sortColumn === "_id" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("paymentMadeFor")}>
                                                    Payment Made For {sortColumn === "paymentMadeFor" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("paymentMethod")}>
                                                    Payment Method {sortColumn === "paymentMethod" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("upiNumber")}>
                                                    UPI Number {sortColumn === "upiNumber" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("accountHolderName")}>
                                                    Account Holder Name {sortColumn === "accountHolderName" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("amount")}>
                                                    Amount {sortColumn === "amount" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("status")}>
                                                    Status {sortColumn === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredPaymentHistory.map((payment) => (
                                                <tr key={payment._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{payment._id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMadeFor}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMethod}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{payment.upiNumber}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{payment.accountHolderName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{payment.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                </tr>
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

export default PaymentHistory;