'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft, 
  FaTimes, FaUserShield, FaUserEdit, FaSave, FaUserPlus, FaEnvelope, 
  FaUser, FaKey 
} from 'react-icons/fa';

export default function UserControl() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user'
  });
  
  const [editForm, setEditForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user'
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/users');
      const result = await response.json();

      if (response.ok) {
        setUsers(result.data || []);
        setFilteredUsers(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch administrative users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('iskcon_admin_token');
      if (!authToken) {
        router.push('/admin/login');
        return;
      }

      // Try decoding token to get current logged in admin ID
      try {
        const parts = authToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          setCurrentAdminId(payload.sub || payload.id);
        }
      } catch (err) {
        console.error('Error decoding auth token:', err);
      }

      setIsAuthenticated(true);
      fetchUsers();
    };

    checkAuth();
  }, [router, fetchUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === '') {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(value.toLowerCase()) ||
      user.email?.toLowerCase().includes(value.toLowerCase()) ||
      user.role.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addForm)
      });
      const result = await response.json();

      if (response.ok) {
        setSuccess('User account created successfully');
        setIsAddModalOpen(false);
        setAddForm({ username: '', password: '', email: '', role: 'user' });
        fetchUsers();
      } else {
        setError(result.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      password: '',
      email: user.email || '',
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload: any = {
      username: editForm.username,
      role: editForm.role,
      email: editForm.email
    };
    if (editForm.password) {
      payload.password = editForm.password;
    }

    try {
      const id = selectedUser._id || selectedUser.id;
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (response.ok) {
        setSuccess('User account updated successfully');
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        setError(result.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleDelete = async (user: any) => {
    const id = user._id || user.id;
    if (id === currentAdminId) {
      alert('You cannot delete your own admin account.');
      return;
    }
    if (id === 'local_admin_id') {
      alert('The primary system admin account cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete the user account "${user.username}"?`)) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (response.ok) {
        setSuccess('User account deleted successfully');
        fetchUsers();
      } else {
        setError(result.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Network error. Please try again.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header navigation */}
        <div className="mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors font-medium">
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <FaUsers className="text-purple-500" /> User Control Panel
            </h1>
            <p className="text-gray-500 mt-1">Create, update roles, manage passwords, and view system administrators.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95"
          >
            <FaPlus /> Add User Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}><FaTimes /></button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-100 flex items-center justify-between font-semibold">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)}><FaTimes /></button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="relative max-w-md">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold" />
                <input
                  type="text"
                  placeholder="Search by username, email, or role..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">System Role</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user: any) => (
                      <tr key={user._id || user.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-2">
                          <FaUser className="text-gray-400 text-xs" />
                          {user.username}
                          {(user._id === currentAdminId || user.id === currentAdminId) && (
                            <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 font-bold">You</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {user.email || <span className="text-gray-400 italic">No email set</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            user.role === 'admin' 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : user.role === 'devotee' 
                              ? 'bg-orange-50 text-orange-700 border-orange-200' 
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <button 
                              onClick={() => handleOpenEdit(user)}
                              className="text-purple-600 hover:bg-purple-50 p-2 rounded-xl transition-colors border border-transparent hover:border-purple-100"
                              title="Edit Account Details"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(user)}
                              disabled={(user._id === currentAdminId || user.id === currentAdminId || (user._id || user.id) === 'local_admin_id')}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors border border-transparent hover:border-red-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:cursor-not-allowed"
                              title="Delete Account"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-gray-400 italic">
                        No administrative users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-purple-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <FaUserPlus className="text-purple-600" /> Create Admin Account
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUser size={12} /></span>
                  <input
                    type="text"
                    required
                    value={addForm.username}
                    onChange={(e) => setAddForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter unique username"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope size={12} /></span>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="admin@iskcondurgapur.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaKey size={12} /></span>
                  <input
                    type="password"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter secure password"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Access Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="devotee">Devotee (Restricted Access)</option>
                  <option value="user">User (View Only)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <FaSave /> Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-purple-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <FaUserEdit className="text-purple-600" /> Edit Admin Account
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={18} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUser size={12} /></span>
                  <input
                    type="text"
                    required
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope size={12} /></span>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Reset Password (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaKey size={12} /></span>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Leave blank to keep current"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Access Role</label>
                <select
                  value={editForm.role}
                  disabled={(selectedUser?._id === 'local_admin_id' || selectedUser?.id === 'local_admin_id')}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="devotee">Devotee (Restricted Access)</option>
                  <option value="user">User (View Only)</option>
                </select>
                {(selectedUser?._id === 'local_admin_id' || selectedUser?.id === 'local_admin_id') && (
                  <span className="text-[10px] text-amber-600 italic mt-1 block">Role of the primary system admin cannot be modified.</span>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
