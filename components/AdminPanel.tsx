import React, { useEffect, useMemo, useState } from 'react';
import { adminCreateUser, adminDeleteUser, listProfiles, updateProfileRole } from '../services/supabaseService';
import { UserProfile } from '../types';

interface AdminPanelProps {
  currentUserId: string;
  currentUserEmail?: string | null;
  userRole?: 'admin' | 'staff' | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUserId, currentUserEmail, userRole }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    role: 'staff' as 'admin' | 'staff'
  });

  const canAccess = userRole === 'admin';

  const loadProfiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listProfiles();
      setProfiles(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canAccess) {
      loadProfiles();
    }
  }, [canAccess]);

  const handleCreate = async () => {
    if (!createForm.email.trim() || !createForm.password.trim()) {
      setError('Email and password are required.');
      return;
    }
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await adminCreateUser({
        email: createForm.email.trim(),
        password: createForm.password,
        role: createForm.role
      });
      setProfiles((prev) => {
        const exists = prev.some((p) => p.id === result.profile.id);
        return exists ? prev : [...prev, result.profile];
      });
      setCreateForm({ email: '', password: '', role: 'staff' });
      setSuccess('User created successfully.');
    } catch (e: any) {
      setError(e.message || 'Failed to create user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = async (userId: string, role: 'admin' | 'staff') => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateProfileRole(userId, role);
      setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, role } : p)));
      setSuccess('Role updated.');
    } catch (e: any) {
      setError(e.message || 'Failed to update role.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === currentUserId) {
      setError('You cannot delete your own account.');
      return;
    }
    const ok = window.confirm('Delete this user? This cannot be undone.');
    if (!ok) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await adminDeleteUser(userId);
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
      setSuccess('User deleted.');
    } catch (e: any) {
      setError(e.message || 'Failed to delete user.');
    } finally {
      setIsSaving(false);
    }
  };

  const sortedProfiles = useMemo(() => {
    const list = [...profiles];
    list.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
    return list;
  }, [profiles]);

  if (!canAccess) {
    return (
      <div className="bg-white rounded-[2.5rem] border-8 border-white shadow-xl p-8 text-center">
        <div className="text-5xl mb-4">⛔</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Admin Access Only</h2>
        <p className="text-slate-500 text-sm">Your account does not have permission to view this panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800">Admin Panel</h2>
          <p className="text-slate-500 text-sm">Create users, assign roles, and manage access.</p>
        </div>
        <div className="bg-white/70 border border-white/60 rounded-2xl px-4 py-3 text-xs font-bold text-slate-600">
          <div className="uppercase tracking-widest text-[10px] text-slate-400">Logged in as</div>
          <div>{currentUserEmail || 'Unknown'}</div>
        </div>
      </div>

      {(error || success) && (
        <div className={`p-4 rounded-2xl border-2 text-xs font-bold ${error ? 'bg-red-50 border-red-100 text-red-700' : 'bg-teal-50 border-teal-100 text-teal-700'}`}>
          {error || success}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border-8 border-white shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800">Create User</h3>
          <button
            onClick={loadProfiles}
            disabled={isLoading}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-teal-700 transition-colors"
          >
            Refresh List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-400 focus:bg-white transition-all text-sm font-medium"
              value={createForm.email}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="newuser@kitchen.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-400 focus:bg-white transition-all text-sm font-medium"
              value={createForm.password}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Role</label>
            <select
              className="w-full px-4 py-3 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-400 focus:bg-white transition-all text-sm font-medium"
              value={createForm.role}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value as 'admin' | 'staff' }))}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={isSaving}
          className="bg-gradient-to-r from-teal-600 to-violet-600 hover:from-teal-700 hover:to-violet-700 text-white font-black py-3 px-6 rounded-2xl shadow-xl shadow-teal-200 text-sm disabled:opacity-60"
        >
          {isSaving ? 'Working...' : 'Create User'}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border-8 border-white shadow-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-800">User List</h3>
          {isLoading && <span className="text-xs font-bold text-slate-400">Loading...</span>}
        </div>

        <div className="space-y-3">
          {sortedProfiles.length === 0 && !isLoading ? (
            <div className="text-sm text-slate-500">No users found.</div>
          ) : (
            sortedProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 rounded-2xl px-4 py-3"
              >
                <div>
                  <div className="font-bold text-slate-800 text-sm">{profile.email || 'Unknown'}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">{profile.id}</div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                    value={profile.role}
                    onChange={(e) => handleRoleChange(profile.id, e.target.value as 'admin' | 'staff')}
                    disabled={isSaving}
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    disabled={isSaving || profile.id === currentUserId}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${profile.id === currentUserId ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
