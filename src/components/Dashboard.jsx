// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminDashboard from '../Views/Admin/AdminDashboard';
import UserDashboard from '../Views/User/UserDashboard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [designation, setDesignation] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedDesignation = localStorage.getItem('designation');
        if (!token) {
            navigate('/');
            toast.error('Please log in to access the dashboard');
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