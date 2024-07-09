import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import DownloadStatement from "./DownloadStatement";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TransactionHistory = () => {

    const userDesignation = localStorage.getItem("designation");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTransactions, setNewTransactions] = useState([
        {
            TxnDate: "",
            ValueDate: "",
            Description: "",
            RefNo: "",
            BranchCode: "",
            Debit: "",
            Credit: "",
            Balance: "",
        },
    ]);

    const [showDownloadStatement, setShowDownloadStatement] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = useState(false);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async (useDateFilter = false) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            let url = `${API_URL}/api/v1/admin/getTransactions`;
            if (useDateFilter && startDate) {
                url += `?startDate=${startDate.toISOString()}`;
                if (endDate) {
                    url += `&endDate=${endDate.toISOString()}`;
                }
            }
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setLoading(false);
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setIsStartDateOpen(false);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setIsEndDateOpen(false);
    };

    const handleClickOutside = (event) => {
        if (
            startDateRef.current &&
            !startDateRef.current.contains(event.target) &&
            endDateRef.current &&
            !endDateRef.current.contains(event.target)
        ) {
            setIsStartDateOpen(false);
            setIsEndDateOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        fetchTransactions();
    };

    const handleFetchData = () => {
        fetchTransactions(true);
    };

    const handleInputChange = (e, index) => {
        const updatedTransactions = [...newTransactions];
        updatedTransactions[index] = {
            ...updatedTransactions[index],
            [e.target.name]: e.target.value,
        };
        setNewTransactions(updatedTransactions);
    };

    const handleAddTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/api/v1/admin/addTransactions`, newTransactions, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewTransactions([
                {
                    TxnDate: "",
                    ValueDate: "",
                    Description: "",
                    RefNo: "",
                    BranchCode: "",
                    Debit: "",
                    Credit: "",
                    Balance: "",
                },
            ]);
            fetchTransactions();
            toast.success("Transactions added successfully");
        } catch (error) {
            console.error("Error adding transactions:", error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const handleAddRow = () => {
        setNewTransactions([
            ...newTransactions,
            {
                TxnDate: "",
                ValueDate: "",
                Description: "",
                RefNo: "",
                BranchCode: "",
                Debit: "",
                Credit: "",
                Balance: "",
            },
        ]);
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
                        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
                        <div className="px-4 py-2 flex space-x-4 relative">
                            <div ref={startDateRef}>
                                <button
                                    onClick={() => {
                                        setIsStartDateOpen(!isStartDateOpen);
                                        setIsEndDateOpen(false);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-reddish-purple to-deep-purple text-white rounded-md focus:outline-none hover:scale-105"
                                >
                                    {startDate ? startDate.toLocaleDateString() : "Start Date"}
                                </button>
                                {isStartDateOpen && (
                                    <div className="absolute mt-2 z-10">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={handleStartDateChange}
                                            inline
                                        />
                                    </div>
                                )}
                            </div>
                            <div ref={endDateRef}>
                                <button
                                    onClick={() => {
                                        setIsEndDateOpen(!isEndDateOpen);
                                        setIsStartDateOpen(false);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-reddish-purple to-deep-purple text-white rounded-md focus:outline-none hover:scale-105"
                                >
                                    {endDate ? endDate.toLocaleDateString() : "End Date"}
                                </button>
                                {isEndDateOpen && (
                                    <div className="absolute mt-2 z-10">
                                        <DatePicker
                                            selected={endDate}
                                            onChange={handleEndDateChange}
                                            inline
                                        />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleFetchData}
                                className="px-4 py-2 bg-gradient-to-r from-reddish-purple to-deep-purple text-white rounded-md focus:outline-none hover:scale-105"
                            >
                                Search
                            </button>
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none hover:bg-red-600"
                            >
                                Clear Filters
                            </button>
                            <div className="flex-grow"></div>
                            <button
                                className="px-4 py-2 bg-gradient-to-r from-reddish-purple to-deep-purple text-white rounded-md focus:outline-none hover:scale-105"
                                onClick={() => setShowDownloadStatement(true)}
                            >
                                Download Statement
                            </button>
                        </div>

                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            {loading ? (
                                <div className="text-center py-4">
                                    <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                    <span className="text-gray-500">Loading transactions...</span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Txn Date
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Value Date
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ref No. / Cheque No.
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Branch Code
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Debit
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Credit
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Balance
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transactions.map((transaction) => (
                                                <tr key={transaction._id}>
                                                    <td className="px-3 py-2 whitespace-nowrap">{new Date(transaction.TxnDate).toLocaleDateString()}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">{new Date(transaction.ValueDate).toLocaleDateString()}</td>
                                                    <td className="px-3 py-2 whitespace-normal w-40 break-words">{transaction.Description}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">{transaction.RefNo}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">{transaction.BranchCode}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">{transaction.Debit}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">{transaction.Credit}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">{transaction.Balance}</td>

                                                </tr>
                                            ))}
                                            {userDesignation === "Director" && (
                                                <>

                                                    {newTransactions.map((transaction, index) => (
                                                        <tr key={index}>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <input
                                                                    type="date"
                                                                    name="TxnDate"
                                                                    value={transaction.TxnDate}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Txn Date"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <input
                                                                    type="date"
                                                                    name="ValueDate"
                                                                    value={transaction.ValueDate}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Value Date"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-normal w-40">
                                                                <textarea
                                                                    name="Description"
                                                                    value={transaction.Description}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Description"
                                                                    rows="2"
                                                                ></textarea>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <input
                                                                    type="text"
                                                                    name="RefNo"
                                                                    value={transaction.RefNo}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Ref No"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <input
                                                                    type="text"
                                                                    name="BranchCode"
                                                                    value={transaction.BranchCode}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Branch Code"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <input
                                                                    type="number"
                                                                    name="Debit"
                                                                    value={transaction.Debit}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Debit"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <input
                                                                    type="number"
                                                                    name="Credit"
                                                                    value={transaction.Credit}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Credit"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <input
                                                                    type="number"
                                                                    name="Balance"
                                                                    value={transaction.Balance}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Balance"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="9" className="px-3 py-2 whitespace-nowrap">
                                                            <button
                                                                onClick={handleAddRow}
                                                                className="px-2 py-1 bg-gradient-to-r from-reddish-purple to-deep-purple text-white rounded-md focus:outline-none hover:scale-105"
                                                            >
                                                                Add Row
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="9" className="px-3 py-2 whitespace-nowrap">
                                                            <button
                                                                onClick={handleAddTransactions}
                                                                className="px-2 py-1 bg-gradient-to-r from-reddish-purple to-deep-purple text-white rounded-md focus:outline-none hover:scale-105"
                                                            >
                                                                Save All
                                                            </button>
                                                        </td>
                                                    </tr>

                                                </>
                                            )
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>
                </motion.div>
            </div>
            {showDownloadStatement && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md">
                        <DownloadStatement startDate={startDate} endDate={endDate} />
                        <button
                            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                            onClick={() => setShowDownloadStatement(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

}

export default TransactionHistory;