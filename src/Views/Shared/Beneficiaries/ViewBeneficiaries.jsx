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
import { FaStar, FaCheckCircle, FaTimesCircle, FaTrash, FaPause, FaPlay, FaChevronDown, FaChevronUp } from "react-icons/fa";

const ViewBeneficiaries = () => {
    const userDesignation = localStorage.getItem("designation");

    const [searchQuery, setSearchQuery] = useState("");
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isNewBeneficiary, setIsNewBeneficiary] = useState(false);
    const [expandedBeneficiaries, setExpandedBeneficiaries] = useState([]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

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
            const beneficiariesData = response.data.data;
            const currentDate = new Date();
            const newBeneficiaries = beneficiariesData.map((beneficiary) => {
                const createdAt = new Date(beneficiary.createdAt);
                const timeDiff = currentDate - createdAt;
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                return { ...beneficiary, isNew: daysDiff <= 7 }; // Consider beneficiaries added within the last 7 days as new
            });
            setBeneficiaries(newBeneficiaries);
            setIsNewBeneficiary(newBeneficiaries.some((beneficiary) => beneficiary.isNew));
            setLoading(false);
            console.log('beneficiaries: ', newBeneficiaries);
        } catch (error) {
            console.error("Error fetching beneficiaries:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const sortedBeneficiaries = filteredBeneficiaries.sort((a, b) => {
        if (sortColumn) {
            const columnA = a[sortColumn];
            const columnB = b[sortColumn];
            if (columnA < columnB) return sortOrder === "asc" ? -1 : 1;
            if (columnA > columnB) return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
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

    const toggleBeneficiaryExpansion = (beneficiaryId) => {
        if (expandedBeneficiaries.includes(beneficiaryId)) {
            setExpandedBeneficiaries(expandedBeneficiaries.filter((id) => id !== beneficiaryId));
        } else {
            setExpandedBeneficiaries([...expandedBeneficiaries, beneficiaryId]);
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

                            <button
                                onClick={() => setIsNewBeneficiary(!isNewBeneficiary)}
                                className="bg-gradient-to-b from-red-500 to-purple-500 text-white px-4 py-2 rounded-md mb-4 w-full sm:w-auto"
                            >
                                {isNewBeneficiary ? "Show All" : "Show New"}
                            </button>

                            {loading ? (
                                <div className="text-center">
                                    <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                    <span className="text-gray-500">Loading beneficiaries...</span>
                                </div>
                            ) : sortedBeneficiaries.length === 0 ? (
                                <div className="text-center text-gray-500 py-4">No beneficiaries found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead>
                                            <tr className="bg-gray-100 text-left text-gray-600">
                                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("name")}>
                                                    Name {sortColumn === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("accountNumber")}>
                                                    Account Number {sortColumn === "accountNumber" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("phoneNumber")}>
                                                    Phone Number {sortColumn === "phoneNumber" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("type")}>
                                                    Type {sortColumn === "type" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("status")}>
                                                    Status {sortColumn === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                                                </th>
                                                <th scope="col" className="px-6 py-3">Actions</th>
                                                <th scope="col" className="px-6 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedBeneficiaries.map((beneficiary) => (
                                                <React.Fragment key={beneficiary._id}>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {beneficiary.isNew && (
                                                                    <FaStar className="text-yellow-500 mr-2" />
                                                                )}
                                                                {beneficiary.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{beneficiary.accountNumber}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{beneficiary.phoneNumber}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{beneficiary.type}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {beneficiary.status === "Active" ? (
                                                                <FaCheckCircle className="text-green-500" />
                                                            ) : (
                                                                <FaTimesCircle className="text-red-500" />
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                                                <button
                                                                    onClick={() => deleteBeneficiary(beneficiary)}
                                                                    className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out w-full sm:w-auto"
                                                                >
                                                                    <FaTrash className="mr-2" />
                                                                    Delete
                                                                </button>
                                                                {userDesignation === "Director" && (
                                                                    <button
                                                                        onClick={() => handleToggleBeneficiaryStatus(beneficiary)}
                                                                        className={`flex items-center justify-center text-white px-4 py-2 rounded-md transition duration-300 ease-in-out w-full sm:w-auto ${beneficiary.status === "Active"
                                                                                ? "bg-yellow-500 hover:bg-yellow-600"
                                                                                : "bg-green-500 hover:bg-green-600"
                                                                            }`}
                                                                    >
                                                                        {beneficiary.status === "Active" ? (
                                                                            <>
                                                                                <FaPause className="mr-2" />
                                                                                Deactivate
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaPlay className="mr-2" />
                                                                                Activate
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => toggleBeneficiaryExpansion(beneficiary._id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                {expandedBeneficiaries.includes(beneficiary._id) ? <FaChevronUp /> : <FaChevronDown />}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedBeneficiaries.includes(beneficiary._id) && (
                                                        <tr>
                                                            <td colSpan="7" className="px-6 py-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <p><strong>IFSC Code:</strong> {beneficiary.ifscCode}</p>
                                                                        <p><strong>Branch:</strong> {beneficiary.branch}</p>
                                                                        <p><strong>Phone Number:</strong> {beneficiary.phoneNumber}</p>
                                                                        <p><strong>Created At:</strong> {beneficiary.createdAt}</p>
                                                                        <p><strong>Updated At:</strong> {beneficiary.updatedAt}</p>
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