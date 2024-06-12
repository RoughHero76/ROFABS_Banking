import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../secrets';
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PaymentRequestsContainer = () => {
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRequests, setExpandedRequests] = useState([]);

    useEffect(() => {
        fetchPaymentRequests();
    }, []);

    const fetchPaymentRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/v1/shared/myPaymentRequests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPaymentRequests(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching payment requests:', error);
            setLoading(false);
            toast.error(error.response?.data?.message || 'An error occurred');
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
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">My Payment Requests, Total Requests: {paymentRequests.length}</h2>
            {loading ? (
                <div className="text-center">
                    <BeatLoader color="#3B82F6" loading={loading} size={10} />
                    <span className="text-gray-500">Loading payment requests...</span>
                </div>
            ) : (
                <div className="max-h-96 overflow-y-auto no-scrollbar">
                    <ul className="space-y-4">
                        {paymentRequests.map((request) => (
                            <li key={request._id}>
                                <div
                                    className="flex items-center justify-between border-b border-gray-200 pb-2 cursor-pointer"
                                    onClick={() => toggleRequestExpansion(request._id)}
                                >
                                    <div className="font-bold">Receiver Name: {request.accountHolderName}</div>
                                    <div>{expandedRequests.includes(request._id) ? <FaChevronUp /> : <FaChevronDown />}</div>
                                </div>
                                {expandedRequests.includes(request._id) && (
                                    <div className="mt-2">
                                        <div className="text-gray-500">Payment Made For: {request.paymentMadeFor}</div>
                                        <div className="text-gray-500">Payment Method: {request.paymentMethod}</div>
                                        {request.paymentMethod === 'UPI' ? (
                                            <div className="text-gray-500">UPI Number: {request.upiNumber}</div>
                                        ) : (
                                            <div className="text-gray-500">Account Number: {request.accountNumber}</div>
                                        )}
                                        <div className="text-gray-500">Amount: {request.amount}</div>
                                        <div className="text-gray-500">Status: {request.status}</div>
                                      
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PaymentRequestsContainer;