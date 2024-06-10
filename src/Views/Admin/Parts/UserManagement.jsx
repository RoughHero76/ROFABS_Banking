// src/Views/Admin/Parts/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { BeatLoader } from "react-spinners";
import Alert from "../../../components/Alert";

const UserManagement = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const [users, setUsers] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        designation: "",
    });
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter((user) => {
        const { name, phoneNumber, designation } = user;
        const query = searchQuery.toLowerCase();
        return (
            name.toLowerCase().includes(query) ||
            phoneNumber.toLowerCase().includes(query) ||
            designation.toLowerCase().includes(query)
        );
    });


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/v1/admin/getUsers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.data);
            setLoading(false);

            console.log(response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    const createUser = async () => {
        try {
            setFormLoading(true);
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/api/v1/admin/createUser`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                password: "",
                designation: "",
            });
            fetchUsers();
            setFormLoading(false);
        } catch (error) {
            console.error("Error creating user:", error);
            setFormLoading(false);
        }
    };

    const updateUser = async () => {
        try {
            setFormLoading(true);
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/api/v1/admin/updateUser`,
                { ...formData, uid: selectedUser.uid },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSelectedUser(null);
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                password: "",
                designation: "",
            });
            fetchUsers();
            setFormLoading(false);
        } catch (error) {
            console.error("Error updating user:", error);
            setFormLoading(false);
        }
    };

    const deleteUser = (user) => {
        setUserToDelete(user);
        setShowAlert(true);
    };
    const confirmDeleteUser = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/api/v1/admin/deleteUser`,
                { uid: userToDelete.uid },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
            setLoading(false);
            setShowAlert(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: "",
            designation: user.designation,
        });
    };

    const handleCancelEdit = () => {
        setSelectedUser(null);
        setFormData({
            name: "",
            email: "",
            phoneNumber: "",
            password: "",
            designation: "",
        });
    };


    const toggleUserStatus = async (uid) => {
        try {
            const token = localStorage.getItem("token");
            await axios.get(`${API_URL}/api/v1/admin/toggleUserStatus?uid=${uid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (error) {
            console.error("Error toggling user status:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-6 flex-1">
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold mb-4">User Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* User Creation Form */}
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">
                                    {selectedUser ? "Edit User" : "Create User"}
                                </h3>
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
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <select
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>
                                            Select Designation
                                        </option>
                                        <option value="CEO">CEO</option>
                                        <option value="CMO">CMO</option>
                                        <option value="CFO">CFO</option>
                                        <option value="Auditor">Auditor</option>
                                        <option value="Accountant">Accountant</option>
                                        <option value="Employee">Employee</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    {selectedUser && (
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={selectedUser ? updateUser : createUser}
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
                                        ) : selectedUser ? (
                                            "Update User"
                                        ) : (
                                            "Create User"
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* User List */}
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">Users</h3>
                                    {selectedUser && (
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                        >
                                            Create User
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, phone number, or designation"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                />
                                {loading ? (
                                    <div className="text-center">
                                        <BeatLoader color="#3B82F6" loading={loading} size={10} />
                                        <span className="text-gray-500">Loading users...</span>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                                        <ul className="space-y-4">
                                            {filteredUsers.map((user) => (
                                                <li
                                                    key={user.uid}
                                                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                                                >
                                                    <div>
                                                        <div className="font-bold">{user.name}</div>
                                                        <div className="text-gray-500">{user.email}</div>
                                                        <div className="text-gray-500">{user.phoneNumber}</div>
                                                        <div className="text-gray-500">{user.designation}</div>
                                                        <div className="text-gray-500">{user.status}</div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user)}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => toggleUserStatus(user.uid)}
                                                            className={`px-4 py-2 rounded-md text-white ${user.status === "Active"
                                                                ? "bg-red-500 hover:bg-red-600"
                                                                : "bg-green-500 hover:bg-green-600"
                                                                }`}
                                                        >
                                                            {user.status === "Active" ? "Deactivate" : "Activate"}
                                                        </button>
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
                    message={`Are you sure you want to delete ${userToDelete.name}?`}
                    onConfirm={confirmDeleteUser}
                    onCancel={() => setShowAlert(false)}
                />
            )}
        </div>
    );
};

export default UserManagement;