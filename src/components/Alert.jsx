// src/components/Alert.js
import React from 'react';

const Alert = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded shadow">
                <p className="text-lg font-bold mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-300 hover:text-gray-900"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={onConfirm}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;
