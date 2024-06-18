// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaHome, FaArrowLeft } from 'react-icons/fa';
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
      <header className="bg-gradient-to-r from-reddish-purple to-deep-purple py-4 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between text-white">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={goToHomePage}
              className="mr-4 flex items-center hover:text-gray-200 text-lg font-bold"
            >
              <FaHome className="mr-2 hover:scale-105" />
              {/* Rofabs Banking */}
            </button>

            <div
              onClick={() => navigate(-1)}
              className="bg-reddish-purple rounded-full w-7 h-7 flex items-center justify-center font-bold mr-2 cursor-pointer hover:scale-105"
            >
              <FaArrowLeft />
            </div>
            <h1 className="text-lg font-bold text-white">Welcome, {name}</h1>
          </div>

          <nav>
            <ul className="flex justify-center space-x-4">
              <li>
                <div
                  onClick={() => navigate('/profile')}
                  className="flex items-center hover:text-gray-200 cursor-pointer hover:scale-105"
                >
                  <FaUser className="mr-2" />
                  Profile
                </div>
              </li>
              <li>
                <div
                  onClick={handleLogout}
                  className="flex items-center hover:text-gray-200 cursor-pointer hover:scale-105"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </div>
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