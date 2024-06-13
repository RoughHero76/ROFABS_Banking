// src/components/Header.js
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
      <header className="bg-gradient-to-r from-reddish-purple to-deep-purple py-4 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between text-white">
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
            <button
              onClick={goToHomePage}
              className="mr-4 flex items-center hover:text-gray-200 text-lg font-bold mb-2 md:mb-0"
            >
              <FaHome className="mr-2" />
            {/*   Rofabs Banking */}
            </button>
            <h1 className="text-lg font-bold">Welcome, {name}</h1>
          </div>
          <nav>
            <ul className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
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