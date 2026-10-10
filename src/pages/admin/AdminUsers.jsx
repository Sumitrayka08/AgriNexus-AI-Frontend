import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Alert from '../../components/Alert';
import { Users, Search, Shield, Award, Sprout, Edit2, X, Save } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('FARMER');

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers(roleFilter);
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch platform users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChangeSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setError('');
    setMessage('');

    try {
      await adminService.updateUserRole(editingUser.id, newRole);
      setMessage(`Updated role for ${editingUser.name} to ${newRole}`);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-1 bg-red-950 text-red-400 border border-red-800/60 rounded-full font-bold text-xs flex items-center gap-1 w-max"><Shield className="w-3 h-3" /> Admin</span>;
      case 'EXPERT':
        return <span className="px-2.5 py-1 bg-blue-950 text-blue-400 border border-blue-800/60 rounded-full font-bold text-xs flex items-center gap-1 w-max"><Award className="w-3 h-3" /> Expert</span>;
      default:
        return <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full font-bold text-xs flex items-center gap-1 w-max"><Sprout className="w-3 h-3" /> Farmer</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" /> Platform User Management
          </h2>
          <p className="text-slate-400 text-sm mt-1">Audit registered accounts and assign security roles</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or email..."
              className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-56"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0 w-full sm:w-auto"
          >
            <option value="">All Roles</option>
            <option value="FARMER">Farmers</option>
            <option value="EXPERT">Experts</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <div className="text-slate-400 text-sm p-6">Loading user directory...</div>
      ) : (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-slate-500">#{u.id}</td>
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 font-mono text-slate-400">{u.email}</td>
                    <td className="p-4">{getRoleBadge(u.role)}</td>
                    <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => { setEditingUser(u); setNewRole(u.role); }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium border border-slate-700 inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Change Role for {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleRoleChangeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Select Security Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="FARMER">Farmer (Dashboard, Farms, Crops, Scans)</option>
                  <option value="EXPERT">Agriculture Expert (Respond to Queries)</option>
                  <option value="ADMIN">Administrator (Full System Control)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-950">
                  <Save className="w-4 h-4" /> Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

