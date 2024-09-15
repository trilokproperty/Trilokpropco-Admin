import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { endPoint } from '../../forAll/forAll';
import { AuthContext } from '../Component/AuthContext/AuthContext';
import { Link } from 'react-router-dom';

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext); // Get the current user from context

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${endPoint}/user`);
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Update user role with confirmation
    const handleRoleChange = async (id, newRole) => {
        if (user?.role !== 'admin') {
            alert("You don't have permission to change roles.");
            return;
        }

        const targetUser = users.find((u) => u._id === id);
        if (!targetUser) return;

        if (window.confirm(`Are you sure you want to change the role of ${targetUser.email} to ${newRole}?`)) {
            try {
                await axios.put(`${endPoint}/user/${id}`, { role: newRole });
                setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Delete user with confirmation
    const handleDelete = async (id) => {
        if (user?.role !== 'admin') {
            alert("You don't have permission to delete users.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${endPoint}/user/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <button className="btn btn-square loading"></button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">User Management</h2>
            <Link to="/signup"><button className="btn btn-sm flex justify-center items-center mb-5 btn-success text-white">Add User</button></Link>
            <div className="overflow-x-auto">
                <table className="table w-full border-collapse bg-white shadow-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user._id} className="border-t">
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">
                                    <select
                                        className="select select-bordered w-full max-w-xs"
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        className="btn btn-error btn-sm text-white"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;
