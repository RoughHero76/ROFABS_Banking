// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminDashboard from '../Views/Admin/AdminDashboard';
import UserDashboard from '../Views/User/UserDashboard';
import { isTokenExpired } from '../utils/auth'; // Assume this function exists

const Dashboard = () => {
    const navigate = useNavigate();
    const [designation, setDesignation] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedDesignation = localStorage.getItem('designation');

        if (!token || isTokenExpired(token)) {
            // Clear localStorage if token is missing or expired
            localStorage.clear();
            navigate('/');
            toast.error('Your session has expired. Please log in again.');
        } else {
            setDesignation(storedDesignation);
        }
    }, [navigate]);

    if (designation === 'Director') {
        return <AdminDashboard />;
    } else {
        return <UserDashboard />;
    }
};

export default Dashboard;