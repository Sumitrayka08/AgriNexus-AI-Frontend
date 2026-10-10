import React, { useState, useEffect } from 'react';
import { farmerService } from '../../services/farmerService';
import Alert from '../../components/Alert';
import { User, Phone, MapPin, Globe, Save } from 'lucide-react';

const FarmerProfile = () => {
  const [profile, setProfile] = useState({
    phone: '',
    address: '',
    state: '',
    district: '',
    village: '',
    landArea: '',
    preferredLanguage: 'English',
  });
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await farmerService.getProfile();
        setUserInfo({ name: data.name, email: data.email, role: data.role });
        setProfile({
          phone: data.phone || '',
          address: data.address || '',
          state: data.state || '',
          district: data.district || '',
          village: data.village || '',
          landArea: data.landArea || '',
          preferredLanguage: data.preferredLanguage || 'English',
        });
      } catch (err) {
        setError('Failed to load farmer profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      await farmerService.updateProfile({
        ...profile,
        landArea: profile.landArea ? parseFloat(profile.landArea) : null,
      });
      setMessage('Profile details updated successfully');
    } catch (err) {
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-400 text-sm p-6">Loading profile details...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-400" /> My Farmer Profile
        </h2>
        <p className="text-slate-400 text-sm mt-1">Manage your contact information, location, and farming preferences</p>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Account Name</span>
            <p className="text-white font-medium text-sm mt-0.5">{userInfo?.name}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Registered Email</span>
            <p className="text-white font-medium text-sm mt-0.5">{userInfo?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Preferred Language</label>
            <select
              value={profile.preferredLanguage}
              onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Marathi">Marathi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Total Land Area (Acres)</label>
            <input
              type="number"
              step="0.1"
              value={profile.landArea}
              onChange={(e) => setProfile({ ...profile, landArea: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 5.5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">State</label>
            <input
              type="text"
              value={profile.state}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="State / Region"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">District</label>
            <input
              type="text"
              value={profile.district}
              onChange={(e) => setProfile({ ...profile, district: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="District"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Village</label>
            <input
              type="text"
              value={profile.village}
              onChange={(e) => setProfile({ ...profile, village: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Village name"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Postal Address</label>
          <textarea
            rows={2}
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Street, Landmark, Pincode"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-950"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
};

export default FarmerProfile;

