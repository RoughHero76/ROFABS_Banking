import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';
import Alert from './Alert';

const Header = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('User');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const handleLogout = () => {
        setShowAlert(true);
    };

    const handleConfirmLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleCancelLogout = () => {
        setShowAlert(false);
    };

    const goToHomePage = () => {
        navigate('/dashboard');
    };

    return (
        <>
            <header className="bg-indigo-600 py-4 px-6">
                <div className="flex justify-between items-center text-white">
                    <div className="flex items-center">
                        <button
                            onClick={goToHomePage}
                            className="mr-4 flex items-center hover:text-gray-200"
                        >
                            <FaHome className="mr-2" />
                            Home
                        </button>
                        <h1 className="text-xl font-bold">Welcome, {name}</h1>
                    </div>
                    <nav>
                        <ul className="flex space-x-4 items-center">
                            <li>
                                <a href="#" className="flex items-center hover:text-gray-200">
                                    <FaUser className="mr-2" />
                                    Profile
                                </a>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="flex items-center hover:text-gray-200">
                                    <FaSignOutAlt className="mr-2" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            {showAlert && (
                <Alert
                    message="Are you sure you want to logout?"
                    onConfirm={handleConfirmLogout}
                    onCancel={handleCancelLogout}
                />
            )}
        </>
    );
};

export default Header;
