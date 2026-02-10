import React, { useState, useEffect } from 'react';
import { User } from '../types';
import {
    fetchAllUsers,
    createUser,
    deleteUser,
    sendPasswordResetEmail,
    updateUserRole
} from '../services/supabaseService';

export const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState<'admin' | 'staff'>('staff');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAllUsers();
            setUsers(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setActionLoading('add');
            setError(null);
            await createUser(newUserEmail, newUserPassword, newUserRole);

            // Clear form and close modal immediately after successful creation
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserRole('staff');
            setShowAddUserModal(false);
            setActionLoading(null);

            // Reload users (if this fails, at least the modal is closed)
            await loadUsers();
        } catch (err: any) {
            setError(err.message || 'Failed to create user');
            setActionLoading(null);
            // Keep modal open on error so user can see what went wrong
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        if (!window.confirm(`Are you sure you want to delete user "${email}"? This action cannot be undone.`)) {
            return;
        }

        try {
            setActionLoading(userId);
            setError(null);
            await deleteUser(userId);
            await loadUsers();
        } catch (err: any) {
            setError(err.message || 'Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleResetPassword = async (email: string) => {
        if (!window.confirm(`Send password reset email to "${email}"?`)) {
            return;
        }

        try {
            setActionLoading(email);
            setError(null);
            await sendPasswordResetEmail(email);
            alert(`Password reset email sent to ${email}`);
        } catch (err: any) {
            setError(err.message || 'Failed to send password reset email');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleRole = async (userId: string, currentRole: 'admin' | 'staff') => {
        const newRole = currentRole === 'admin' ? 'staff' : 'admin';

        if (!window.confirm(`Change user role from ${currentRole} to ${newRole}?`)) {
            return;
        }

        try {
            setActionLoading(userId + '-role');
            setError(null);
            await updateUserRole(userId, newRole);
            await loadUsers();
        } catch (err: any) {
            setError(err.message || 'Failed to update user role');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-6xl animate-spin">🔐</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-violet-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-teal-200">
                        🔐
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-stone-800 tracking-tight">Admin Panel</h1>
                        <p className="text-stone-500 text-sm font-medium">Manage users and permissions</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-gradient-to-r from-teal-600 to-violet-600 hover:from-teal-700 hover:to-violet-700 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-teal-200 transition-all flex items-center space-x-2"
                >
                    <span>➕</span>
                    <span>Add User</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 md:p-6 bg-red-50 border-4 border-white rounded-[2rem] text-red-700 shadow-xl flex items-center justify-between animate-fade-in">
                    <div className="flex items-center space-x-4">
                        <span className="text-2xl md:text-4xl">🌵</span>
                        <p className="font-bold text-sm md:text-base">{error}</p>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm text-red-800"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-[3rem] shadow-xl border-8 border-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-teal-50 to-violet-50">
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-stone-600">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-stone-600">Role</th>
                                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-stone-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-stone-400">
                                        <div className="flex flex-col items-center space-y-4">
                                            <span className="text-6xl opacity-20">👥</span>
                                            <p className="text-lg font-bold">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-teal-50/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-stone-700">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleRole(user.id, user.role)}
                                                disabled={actionLoading === user.id + '-role'}
                                                className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${user.role === 'admin'
                                                    ? 'bg-gradient-to-r from-teal-100 to-violet-100 text-teal-700 hover:from-teal-200 hover:to-violet-200'
                                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {actionLoading === user.id + '-role' ? '...' : user.role}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleResetPassword(user.email)}
                                                    disabled={actionLoading === user.email}
                                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Send password reset email"
                                                >
                                                    {actionLoading === user.email ? '...' : '🔑 Reset'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                                    disabled={actionLoading === user.id}
                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete user"
                                                >
                                                    {actionLoading === user.id ? '...' : '🗑️ Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl border-8 border-white max-w-md w-full p-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-stone-800">Add New User</h2>
                            <button
                                onClick={() => setShowAddUserModal(false)}
                                className="text-stone-400 hover:text-stone-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="user@example.com"
                                    className="w-full px-6 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-400 focus:bg-white transition-all text-sm font-medium"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-400 focus:bg-white transition-all text-sm font-medium"
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                    Role
                                </label>
                                <select
                                    className="w-full px-6 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-400 focus:bg-white transition-all text-sm font-medium"
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'staff')}
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddUserModal(false)}
                                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-black py-4 rounded-2xl transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading === 'add'}
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-violet-600 hover:from-teal-700 hover:to-violet-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-200 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading === 'add' ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
