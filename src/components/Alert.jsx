// src/components/Alert.js
import React from 'react';

const Alert = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-bold mb-4 text-black-700">{message}</p>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 hover:text-gray-900 transition-colors duration-300"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;