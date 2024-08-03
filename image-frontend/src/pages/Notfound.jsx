import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-400 to-yellow-500">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">The page you are looking for does not exist.</p>
                <Link 
                    to="/" 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
