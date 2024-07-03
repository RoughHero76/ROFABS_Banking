// src/components/BankDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../secrets';
import { toast } from 'react-toastify';

const BankDetailsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('addBankDetails');
    const [bankDetails, setBankDetails] = useState({
        accountName: '',
        address: '',
        accountNumber: '',
        accountDescription: '',
        branch: '',
        drawingPower: '',
        interestRatePA: '',
        modBalance: '',
        cifNo: '',
        ifsCode: '',
        micrCode: '',
    });
    const [banks, setBanks] = useState([]);
    const [selectedBankId, setSelectedBankId] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);

    useEffect(() => {
        if (isOpen && activeTab === 'viewBanks') {
            fetchBanks();
        }
    }, [isOpen, activeTab]);

    const fetchBanks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/v1/admin/getBankDetails`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBanks(response.data);
        } catch (error) {
            console.error('Error fetching bank details:', error);
            toast.error('An error occurred while fetching bank details');
        }
    };

    const fetchBankDetailsById = async () => {
        if (!selectedBankId) {
            toast.error('Please enter a bank ID');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/v1/admin/getBankDetailsById/${selectedBankId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedBank(response.data);
        } catch (error) {
            console.error('Error fetching bank details:', error);
            toast.error('An error occurred while fetching the bank details');
        }
    };

    const handleInputChange = (e) => {
        setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/v1/admin/addBankDetails`, bankDetails, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Bank details added successfully');
            setBankDetails({
                accountName: '',
                address: '',
                accountNumber: '',
                accountDescription: '',
                branch: '',
                drawingPower: '',
                interestRatePA: '',
                modBalance: '',
                cifNo: '',
                ifsCode: '',
                micrCode: '',
            });
            setActiveTab('viewBanks');
            fetchBanks();
        } catch (error) {
            console.error('Error adding bank details:', error);
            toast.error(error.response?.data?.error || 'An error occurred');
        }
    };

    const handleModalClose = () => {
        onClose();
        setActiveTab('addBankDetails');
        setSelectedBank(null);
        setSelectedBankId('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">Bank Details</h2>
                    <button
                        onClick={handleModalClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="mb-4 flex flex-wrap">
                    <button
                        onClick={() => setActiveTab('addBankDetails')}
                        className={`px-4 py-2 mr-2 mb-2 ${activeTab === 'addBankDetails' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            } rounded-md focus:outline-none hover:bg-blue-600`}
                    >
                        Add Bank Details
                    </button>
                    <button
                        onClick={() => setActiveTab('viewBanks')}
                        className={`px-4 py-2 mr-2 mb-2 ${activeTab === 'viewBanks' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            } rounded-md focus:outline-none hover:bg-blue-600`}
                    >
                        View Banks
                    </button>
                    <button
                        onClick={() => setActiveTab('getBankDetailsById')}
                        className={`px-4 py-2 mb-2 ${activeTab === 'getBankDetailsById' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            } rounded-md focus:outline-none hover:bg-blue-600`}
                    >
                        Get Details By ID
                    </button>
                </div>
                {activeTab === 'addBankDetails' && (
                    <div className="max-h-[60vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="accountName" className="block mb-1">
                                    Account Name
                                </label>
                                <input
                                    type="text"
                                    id="accountName"
                                    name="accountName"
                                    value={bankDetails.accountName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={bankDetails.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="accountNumber" className="block mb-1">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    id="accountNumber"
                                    name="accountNumber"
                                    value={bankDetails.accountNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="accountDescription" className="block mb-1">
                                    Account Description
                                </label>
                                <input
                                    type="text"
                                    id="accountDescription"
                                    name="accountDescription"
                                    value={bankDetails.accountDescription}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="branch" className="block mb-1">
                                    Branch
                                </label>
                                <input
                                    type="text"
                                    id="branch"
                                    name="branch"
                                    value={bankDetails.branch}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="drawingPower" className="block mb-1">
                                    Drawing Power
                                </label>
                                <input
                                    type="text"
                                    id="drawingPower"
                                    name="drawingPower"
                                    value={bankDetails.drawingPower}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="interestRatePA" className="block mb-1">
                                    Interest Rate (PA)
                                </label>
                                <input
                                    type="text"
                                    id="interestRatePA"
                                    name="interestRatePA"
                                    value={bankDetails.interestRatePA}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="modBalance" className="block mb-1">
                                    Mod Balance
                                </label>
                                <input
                                    type="text"
                                    id="modBalance"
                                    name="modBalance"
                                    value={bankDetails.modBalance}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="cifNo" className="block mb-1">
                                    CIF Number
                                </label>
                                <input
                                    type="text"
                                    id="cifNo"
                                    name="cifNo"
                                    value={bankDetails.cifNo}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="ifsCode" className="block mb-1">
                                    IFSC Code
                                </label>
                                <input
                                    type="text"
                                    id="ifsCode"
                                    name="ifsCode"
                                    value={bankDetails.ifsCode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="micrCode" className="block mb-1">
                                    MICR Code
                                </label>
                                <input
                                    type="text"
                                    id="micrCode"
                                    name="micrCode"
                                    value={bankDetails.micrCode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md focus:outline-none hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                {activeTab === 'viewBanks' && (
                    <div>
                        <h3 className="text-lg md:text-xl font-bold mb-2">Bank List</h3>
                        {banks.length === 0 ? (
                            <p>No banks found.</p>
                        ) : (
                            <ul>
                                {banks.map((bank) => (
                                    <li key={bank._id} className="mb-4">
                                        <div className="md:flex md:justify-between">
                                            <div className="mb-2 md:mb-0">
                                                <p>
                                                    <strong>Account Name:</strong> {bank.accountName}
                                                </p>
                                                <p>
                                                    <strong>Account Number:</strong> {bank.accountNumber}
                                                </p>
                                                <p>
                                                    <strong>Branch:</strong> {bank.branch}
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <strong>IFSC Code:</strong> {bank.ifsCode}
                                                </p>
                                                <p>
                                                    <strong>MICR Code:</strong> {bank.micrCode}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {activeTab === 'getBankDetailsById' && (
                    <div>
                        <h3 className="text-lg md:text-xl font-bold mb-2">Get Bank Details By ID</h3>
                        <div className="mb-4">
                            <label htmlFor="bankId" className="block mb-1">
                                Bank ID
                            </label>
                            <input
                                type="text"
                                id="bankId"
                                value={selectedBankId}
                                onChange={(e) => setSelectedBankId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={fetchBankDetailsById}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                        >
                            Get Details
                        </button>
                        {selectedBank && (
                            <div className="mt-4">
                                <h4 className="text-lg font-bold mb-2">Bank Details</h4>
                                <div className="md:flex md:justify-between">
                                    <div className="mb-2 md:mb-0">
                                        <p>
                                            <strong>Account Name:</strong> {selectedBank.accountName}
                                        </p>
                                        <p>
                                            <strong>Account Number:</strong> {selectedBank.accountNumber}
                                        </p>
                                        <p>
                                            <strong>Branch:</strong> {selectedBank.branch}
                                        </p>
                                        <p>
                                            <strong>IFSC Code:</strong> {selectedBank.ifsCode}
                                        </p>
                                        <p>
                                            <strong>MICR Code:</strong> {selectedBank.micrCode}
                                        </p>
                                        <p>
                                            <strong>Address:</strong> {selectedBank.address}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <strong>Account Description:</strong> {selectedBank.accountDescription}
                                        </p>
                                        <p>
                                            <strong>Drawing Power:</strong> {selectedBank.drawingPower}
                                        </p>
                                        <p>
                                            <strong>Interest Rate (PA):</strong> {selectedBank.interestRatePA}
                                        </p>
                                        <p>
                                            <strong>Mod Balance:</strong> {selectedBank.modBalance}
                                        </p>
                                        <p>
                                            <strong>CIF Number:</strong> {selectedBank.cifNo}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
export default BankDetailsModal;
