import React, { useState, useEffect } from 'react';
import { cropService } from '../../services/cropService';
import { farmService } from '../../services/farmService';
import Alert from '../../components/Alert';
import { Wheat, Plus, Edit2, Trash2, Calendar, Tag, X, Save, Layers } from 'lucide-react';

const FarmerCrops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    farmId: '',
    cropName: '',
    variety: '',
    season: 'Kharif',
    sowingDate: '',
    expectedHarvestDate: '',
    status: 'PLANTED',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const farmsData = await farmService.getFarms();
      setFarms(farmsData);

      const cropsData = await cropService.getCrops();
      setCrops(cropsData);
    } catch (err) {
      setError('Failed to load crop records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingCrop(null);
    setFormData({
      farmId: farms.length > 0 ? farms[0].id : '',
      cropName: '',
      variety: '',
      season: 'Kharif',
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      status: 'PLANTED',
      notes: '',
    });
    setShowModal(true);
  };

  const openEditModal = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farm?.id || '',
      cropName: crop.cropName || '',
      variety: crop.variety || '',
      season: crop.season || 'Kharif',
      sowingDate: crop.sowingDate || '',
      expectedHarvestDate: crop.expectedHarvestDate || '',
      status: crop.status || 'PLANTED',
      notes: crop.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crop record?')) return;
    try {
      await cropService.deleteCrop(id);
      setMessage('Crop record deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete crop');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editingCrop) {
        await cropService.updateCrop(editingCrop.id, formData);
        setMessage('Crop cycle updated successfully');
      } else {
        await cropService.addCrop(formData, formData.farmId);
        setMessage('New crop planted successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError('Failed to save crop cycle');
    }
  };

  const filteredCrops = selectedFarmId
    ? crops.filter((c) => String(c.farm?.id || c.farmId) === String(selectedFarmId))
    : crops;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wheat className="w-6 h-6 text-amber-400" /> My Crop Cycles
          </h2>
          <p className="text-slate-400 text-sm mt-1">Track planted varieties, growth stages, sowing dates, and harvest schedules</p>
        </div>
        <div className="flex items-center gap-3">
          {farms.length > 0 && (
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Farms ({farms.length})</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>{f.farmName}</option>
              ))}
            </select>
          )}
          <button
            onClick={openAddModal}
            disabled={farms.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-950 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Plant New Crop</span>
          </button>
        </div>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <div className="text-slate-400 text-sm p-6">Loading crop records...</div>
      ) : farms.length === 0 ? (
        <Alert type="warning" message="Please register at least one Farm Land before adding crop cycles." />
      ) : filteredCrops.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <Wheat className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No crop cycles recorded</h3>
          <p className="text-slate-400 text-sm mt-1">Click 'Plant New Crop' to track your sowing and harvest dates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCrops.map((crop) => (
            <div key={crop.id} className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{crop.cropName}</h3>
                    <p className="text-xs text-emerald-400 font-medium">{crop.variety || 'Standard Variety'}</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-950 text-amber-400 border border-amber-800/50">
                    {crop.status || 'PLANTED'}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-slate-500" /><span>Farm: {crop.farm?.farmName}</span></div>
                  <div className="flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-slate-500" /><span>Season: {crop.season}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-500" /><span>Sown: {crop.sowingDate || 'N/A'}</span></div>
                  {crop.expectedHarvestDate && <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-emerald-500" /><span>Harvest: {crop.expectedHarvestDate}</span></div>}
                </div>
                {crop.notes && <p className="text-xs text-slate-400 mt-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800">{crop.notes}</p>}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button onClick={() => openEditModal(crop)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(crop.id)} className="p-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 rounded-lg border border-rose-800/50" title="Delete">
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
              <h3 className="text-lg font-bold text-white">{editingCrop ? 'Edit Crop Cycle' : 'Plant New Crop'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target Farm *</label>
                <select
                  required
                  value={formData.farmId}
                  onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>{f.farmName} ({f.location || 'Location unspecified'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Crop Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Rice, Wheat, Maize"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Variety</label>
                  <input
                    type="text"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Basmati, Hybrid PB1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Season</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Crop Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="PLANTED">Planted / Sown</option>
                    <option value="VEGETATIVE">Vegetative Growth</option>
                    <option value="FLOWERING">Flowering / Silking</option>
                    <option value="HARVEST_READY">Harvest Ready</option>
                    <option value="HARVESTED">Harvest Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Sowing Date</label>
                  <input
                    type="date"
                    value={formData.sowingDate}
                    onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    value={formData.expectedHarvestDate}
                    onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Agronomic Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Seed treatment, fertilizer schedule, etc."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950">
                  <Save className="w-4 h-4" /> Save Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerCrops;

