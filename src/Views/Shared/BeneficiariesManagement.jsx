// src/Views/Shared/BeneficiariesManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../secrets";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { BeatLoader } from "react-spinners";
import Alert from "../../components/Alert";
import { toast } from "react-toastify";

const BeneficiariesManagement = () => {

    const userDesignation = localStorage.getItem("designation");

    const [searchQuery, setSearchQuery] = useState("");
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        accountNumber: "",
        phoneNumber: "",
        ifscCode: "",
        type: "",
    });
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

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
            setBeneficiaries(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching beneficiaries:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const addBeneficiary = async () => {
        try {
            setFormLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/api/v1/shared/addBeneficiary`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                name: "",
                accountNumber: "",
                phoneNumber: "",
                ifscCode: "",
                type: "",
            });
            fetchBeneficiaries();
            setFormLoading(false);
            toast.success(response?.data?.message || "Beneficiary added successfully");
        } catch (error) {
            console.error("Error adding beneficiary:", error);
            setFormLoading(false);
            toast.error(error.response?.data?.message || "An error occurred");
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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-6 flex-1">
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold mb-4">Beneficiaries Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Beneficiary Creation Form */}
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Add Beneficiary</h3>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleInputChange}
                                        placeholder="Account Number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={handleInputChange}
                                        placeholder="IFSC Code"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>
                                            Select Type
                                        </option>
                                        <option value="Vendor">Vendor</option>
                                        <option value="Employee">Employee</option>
                                        <option value="Director">Director</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={addBeneficiary}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                        disabled={formLoading}
                                    >
                                        {formLoading ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Loading...
                                            </span>
                                        ) : (
                                            "Add Beneficiary"
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Beneficiary List */}
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Beneficiaries</h3>
                                <input
                                    type="text"
                                    placeholder="Search by name, phone number, or account number"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                />
                                {loading ? (
                                    <div className="text-center">
                                        <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                        <span className="text-gray-500">Loading beneficiaries...</span>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto">
                                        <ul className="space-y-4">
                                            {filteredBeneficiaries.map((beneficiary) => (
                                                <li
                                                    key={beneficiary._id}
                                                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                                                >
                                                    <div>
                                                        <div className="font-bold">Name: {beneficiary.name}</div>
                                                        <div className="text-gray-500">Account Number: {beneficiary.accountNumber}</div>
                                                        <div className="text-gray-500">Phone Number: {beneficiary.phoneNumber}</div>
                                                        <div className="text-gray-500">IFSC CODE: {beneficiary.ifscCode}</div>
                                                        <div className="text-gray-500">Type: {beneficiary.type}</div>
                                                        <div className="text-gray-500">Status: {beneficiary.status}
                                                            {
                                                                beneficiary.status === "Active" ? null : <span className="text-gray-500 ml-3">Please Ask Admin To Activate It</span>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => deleteBeneficiary(beneficiary)}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>

                                                        {
                                                            userDesignation === "Director" && <button
                                                                onClick={() => handleToggleBeneficiaryStatus(beneficiary)}
                                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                                            >
                                                                Toggle Status
                                                            </button>

                                                        }

                                                    </div>


                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {showAlert && (
                <Alert
                    message={`Are you sure you want to delete ${beneficiaryToDelete.name}?`}
                    onConfirm={confirmDeleteBeneficiary}
                    onCancel={() => setShowAlert(false)}
                />
            )}
        </div>
    );
};

export default BeneficiariesManagement;