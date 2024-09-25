import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { endPoint } from '../../forAll/forAll';
import { AuthContext } from '../Component/AuthContext/AuthContext';

const ChangePass = () => {
    const { id } = useParams(); // Extract user ID from URL
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Access the current user from AuthContext
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    // State to hold the current password (hashed)
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        // Set the current password from the user context
        if (user && user.password) {
            setCurrentPassword(user.password);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Simple validation to ensure both passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Send the request to update the user password
            const response = await axios.put(`${endPoint}/user/${id}`, { password });
            if (response.status === 200) {
                alert('Password updated successfully!');
                navigate('/'); // Navigate to a success page or another route
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setError('Failed to update password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-5">
            <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
            <form onSubmit={handleSubmit}>
                {/* Display current password (hashed) */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Change Password
                </button>
            </form>
        </div>
    </div>
    
    );
};

export default ChangePass;
