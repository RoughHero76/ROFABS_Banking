// src/Views/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../secrets';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { FaEdit, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    password: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/v1/shared/getProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      const updatedData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      };
      await axios.post(`${API_URL}/api/v1/shared/updateProfile`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormLoading(false);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    fetchProfile();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
          <div className="container mx-auto px-4 py-4">
            <h2 className="text-3xl font-bold text-black mb-2">Profile</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="bg-white shadow-lg rounded-lg p-8"
            >
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <FaSpinner className="animate-spin text-4xl text-purple-500" />
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <label className="block font-bold mb-2 text-gray-700">Name:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.name}</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block font-bold mb-2 text-gray-700">Email:</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.email}</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block font-bold mb-2 text-gray-700">Phone Number:</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.phoneNumber}</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block font-bold mb-2 text-gray-700">Designation:</label>
                    <p className="text-gray-800">{formData.designation}</p>
                  </div>
                  {isEditing && (
                    <div className="mb-6">
                      <label className="block font-bold mb-2 text-gray-700">Password:</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter new password (leave blank to keep current password)"
                        className="w-full px-4 py-3 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                  <div className="flex justify-end">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancelClick}
                          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 mr-4"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={updateProfile}
                          className="bg-gradient-to-r from-reddish-purple to-deep-purple text-white px-6 py-3 rounded-md  flex items-center"
                          disabled={formLoading}
                        >
                          {formLoading ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Updating...
                            </>
                          ) : (
                            'Update Profile'
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEditClick}
                        className="bg-gradient-to-r from-reddish-purple to-deep-purple text-white px-6 py-3 rounded-md  flex items-center"
                      >
                        <FaEdit className="mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;