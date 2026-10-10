import React, { useState, useEffect } from 'react';
import { farmService } from '../../services/farmService';
import Alert from '../../components/Alert';
import { Tractor, Plus, Edit2, Trash2, MapPin, Layers, Droplet, X, Save } from 'lucide-react';

const FarmerFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    area: '',
    soilType: 'Loamy',
    irrigationMethod: 'Drip Irrigation',
  });

  const fetchFarms = async () => {
    try {
      const data = await farmService.getFarms();
      setFarms(data);
    } catch (err) {
      setError('Failed to fetch farm lands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const openAddModal = () => {
    setEditingFarm(null);
    setFormData({ farmName: '', location: '', area: '', soilType: 'Loamy', irrigationMethod: 'Drip Irrigation' });
    setShowModal(true);
  };

  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setFormData({
      farmName: farm.farmName || '',
      location: farm.location || '',
      area: farm.area || '',
      soilType: farm.soilType || 'Loamy',
      irrigationMethod: farm.irrigationMethod || 'Drip Irrigation',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm? All associated crop records will also be removed.')) return;
    try {
      await farmService.deleteFarm(id);
      setMessage('Farm deleted successfully');
      fetchFarms();
    } catch (err) {
      setError('Failed to delete farm');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...formData,
      area: formData.area ? parseFloat(formData.area) : null,
    };

    try {
      if (editingFarm) {
        await farmService.updateFarm(editingFarm.id, payload);
        setMessage('Farm land updated successfully');
      } else {
        await farmService.addFarm(payload);
        setMessage('New farm registered successfully');
      }
      setShowModal(false);
      fetchFarms();
    } catch (err) {
      setError('Failed to save farm record');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tractor className="w-6 h-6 text-emerald-400" /> My Farm Lands
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage your agricultural plots, soil classification, and watering setups</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-950 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Farm</span>
        </button>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <div className="text-slate-400 text-sm p-6">Loading farms...</div>
      ) : farms.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <Tractor className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No farms registered yet</h3>
          <p className="text-slate-400 text-sm mt-1">Add your first farm land to start tracking crops and soil health</p>
          <button onClick={openAddModal} className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-semibold rounded-xl text-xs">
            + Register Farm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((farm) => (
            <div key={farm.id} className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white">{farm.farmName}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {farm.area ? `${farm.area} Acres` : 'N/A'}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /><span>{farm.location || 'Location unspecified'}</span></div>
                  <div className="flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-slate-500" /><span>Soil: {farm.soilType || 'Loamy'}</span></div>
                  <div className="flex items-center gap-2"><Droplet className="w-3.5 h-3.5 text-slate-500" /><span>Irrigation: {farm.irrigationMethod || 'Drip'}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button onClick={() => openEditModal(farm)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(farm.id)} className="p-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 rounded-lg border border-rose-800/50" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{editingFarm ? 'Edit Farm Details' : 'Register New Farm Land'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Farm Name *</label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Green Valley Plot A"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Location / District</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="North Sector, Village Kher"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 4.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Alluvial">Alluvial</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Black Cotton">Black Cotton</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Clayey">Clayey</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Irrigation Method</label>
                <select
                  value={formData.irrigationMethod}
                  onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Drip Irrigation">Drip Irrigation</option>
                  <option value="Sprinkler System">Sprinkler System</option>
                  <option value="Canal / Flood">Canal / Flood</option>
                  <option value="Borewell Pump">Borewell Pump</option>
                  <option value="Rainfed">Rainfed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950">
                  <Save className="w-4 h-4" /> Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerFarms;

