import React, { useState, useEffect } from 'react';
import { soilService } from '../../services/soilService';
import { farmService } from '../../services/farmService';
import Alert from '../../components/Alert';
import { CloudSun, Save, Activity } from 'lucide-react';

const FarmerSoil = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [soilInfo, setSoilInfo] = useState({
    id: null,
    soilType: 'Loamy',
    ph: 6.5,
    nitrogen: 120,
    phosphorus: 40,
    potassium: 50,
    organicMatter: 2.5,
    moisture: 45,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const farmsData = await farmService.getFarms();
        setFarms(farmsData);
        if (farmsData.length > 0) {
          setSelectedFarmId(farmsData[0].id.toString());
        }
      } catch (err) {
        setError('Failed to load farms list');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  useEffect(() => {
    if (!selectedFarmId) return;

    const fetchSoilData = async () => {
      setLoading(true);
      try {
        const list = await soilService.getSoilByFarm(selectedFarmId);
        if (list && list.length > 0) {
          const latest = list[list.length - 1];
          setSoilInfo({
            id: latest.id,
            soilType: latest.soilType || 'Loamy',
            ph: latest.ph !== null ? latest.ph : 6.5,
            nitrogen: latest.nitrogen !== null ? latest.nitrogen : 120,
            phosphorus: latest.phosphorus !== null ? latest.phosphorus : 40,
            potassium: latest.potassium !== null ? latest.potassium : 50,
            organicMatter: latest.organicMatter !== null ? latest.organicMatter : 2.5,
            moisture: latest.moisture !== null ? latest.moisture : 45,
          });
        } else {
          setSoilInfo({
            id: null,
            soilType: 'Loamy',
            ph: 6.5,
            nitrogen: 120,
            phosphorus: 40,
            potassium: 50,
            organicMatter: 2.5,
            moisture: 45,
          });
        }
      } catch (err) {
        setError('Failed to fetch soil data for selected farm');
      } finally {
        setLoading(false);
      }
    };

    fetchSoilData();
  }, [selectedFarmId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    if (soilInfo.ph < 0 || soilInfo.ph > 14) {
      setError('Soil pH must be between 0.0 and 14.0');
      setSaving(false);
      return;
    }

    const payload = {
      soilType: soilInfo.soilType,
      ph: parseFloat(soilInfo.ph),
      nitrogen: parseFloat(soilInfo.nitrogen),
      phosphorus: parseFloat(soilInfo.phosphorus),
      potassium: parseFloat(soilInfo.potassium),
      organicMatter: parseFloat(soilInfo.organicMatter),
      moisture: parseFloat(soilInfo.moisture),
    };

    try {
      if (soilInfo.id) {
        await soilService.updateSoilInfo(soilInfo.id, payload);
        setMessage('Soil health record updated successfully');
      } else {
        const saved = await soilService.saveSoilInfo(payload, selectedFarmId);
        setSoilInfo((prev) => ({ ...prev, id: saved.id }));
        setMessage('New soil health record saved successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save soil information');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-sky-400" /> Soil Health & Chemistry
          </h2>
          <p className="text-slate-400 text-sm mt-1">Record pH, N-P-K nutrient levels, organic matter, and moisture percentage per farm plot</p>
        </div>
        {farms.length > 0 && (
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>{f.farmName} ({f.location || 'Plot'})</option>
            ))}
          </select>
        )}
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {farms.length === 0 ? (
        <Alert type="warning" message="Please register a Farm Land under 'My Farms' before configuring soil records." />
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Soil Classification</label>
              <select
                value={soilInfo.soilType}
                onChange={(e) => setSoilInfo({ ...soilInfo, soilType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Loamy">Loamy Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Black Cotton">Black Cotton Soil</option>
                <option value="Red Soil">Red Soil</option>
                <option value="Clayey">Clayey Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Soil pH Level (0 - 14)</label>
              <input
                type="number"
                step="0.1"
                required
                value={soilInfo.ph}
                onChange={(e) => setSoilInfo({ ...soilInfo, ph: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="6.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Moisture (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={soilInfo.moisture}
                onChange={(e) => setSoilInfo({ ...soilInfo, moisture: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="45"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Primary Soil Nutrients (N-P-K Ratio in kg/ha)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-400 uppercase mb-1">Nitrogen (N)</label>
                <input
                  type="number"
                  required
                  value={soilInfo.nitrogen}
                  onChange={(e) => setSoilInfo({ ...soilInfo, nitrogen: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-400 uppercase mb-1">Phosphorus (P)</label>
                <input
                  type="number"
                  required
                  value={soilInfo.phosphorus}
                  onChange={(e) => setSoilInfo({ ...soilInfo, phosphorus: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-400 uppercase mb-1">Potassium (K)</label>
                <input
                  type="number"
                  required
                  value={soilInfo.potassium}
                  onChange={(e) => setSoilInfo({ ...soilInfo, potassium: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Organic Matter (%)</label>
            <input
              type="number"
              step="0.1"
              value={soilInfo.organicMatter}
              onChange={(e) => setSoilInfo({ ...soilInfo, organicMatter: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="2.5"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-sm shadow-lg shadow-emerald-950"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Soil Chemistry Record'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default FarmerSoil;

