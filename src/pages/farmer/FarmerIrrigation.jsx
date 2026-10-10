import React, { useState, useEffect } from 'react';
import { irrigationService } from '../../services/irrigationService';
import { farmService } from '../../services/farmService';
import Alert from '../../components/Alert';
import { Droplet, Calendar, Save } from 'lucide-react';

const FarmerIrrigation = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [irrigationInfo, setIrrigationInfo] = useState({
    id: null,
    irrigationType: 'Drip Irrigation',
    frequency: 'Every 3 days',
    waterSource: 'Borewell',
    lastIrrigationDate: '',
    nextIrrigationDate: '',
    notes: '',
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

    const fetchIrrigationData = async () => {
      setLoading(true);
      try {
        const list = await irrigationService.getIrrigationByFarm(selectedFarmId);
        if (list && list.length > 0) {
          const latest = list[list.length - 1];
          setIrrigationInfo({
            id: latest.id,
            irrigationType: latest.irrigationType || 'Drip Irrigation',
            frequency: latest.frequency || 'Every 3 days',
            waterSource: latest.waterSource || 'Borewell',
            lastIrrigationDate: latest.lastIrrigationDate || '',
            nextIrrigationDate: latest.nextIrrigationDate || '',
            notes: latest.notes || '',
          });
        } else {
          setIrrigationInfo({
            id: null,
            irrigationType: 'Drip Irrigation',
            frequency: 'Every 3 days',
            waterSource: 'Borewell',
            lastIrrigationDate: '',
            nextIrrigationDate: '',
            notes: '',
          });
        }
      } catch (err) {
        setError('Failed to fetch irrigation schedule for selected farm');
      } finally {
        setLoading(false);
      }
    };

    fetchIrrigationData();
  }, [selectedFarmId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      if (irrigationInfo.id) {
        await irrigationService.updateIrrigation(irrigationInfo.id, irrigationInfo);
        setMessage('Irrigation schedule updated successfully');
      } else {
        const saved = await irrigationService.saveIrrigation(irrigationInfo, selectedFarmId);
        setIrrigationInfo((prev) => ({ ...prev, id: saved.id }));
        setMessage('New irrigation schedule configured successfully');
      }
    } catch (err) {
      setError('Failed to save irrigation details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Droplet className="w-6 h-6 text-blue-400" /> Irrigation Tracker
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage watering schedules, source availability, and upcoming irrigation cycles</p>
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
        <Alert type="warning" message="Please register a Farm Land under 'My Farms' before setting up irrigation schedules." />
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Irrigation Method</label>
              <select
                value={irrigationInfo.irrigationType}
                onChange={(e) => setIrrigationInfo({ ...irrigationInfo, irrigationType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler System">Sprinkler System</option>
                <option value="Canal / Flood">Canal / Flood</option>
                <option value="Borewell Pump">Borewell Pump</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Frequency</label>
              <input
                type="text"
                value={irrigationInfo.frequency}
                onChange={(e) => setIrrigationInfo({ ...irrigationInfo, frequency: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Every 2 days, Twice a week"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Water Source</label>
              <input
                type="text"
                value={irrigationInfo.waterSource}
                onChange={(e) => setIrrigationInfo({ ...irrigationInfo, waterSource: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Borewell, Canal, River, Pond"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Last Irrigation Date</label>
              <input
                type="date"
                value={irrigationInfo.lastIrrigationDate}
                onChange={(e) => setIrrigationInfo({ ...irrigationInfo, lastIrrigationDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Next Scheduled Irrigation</label>
              <input
                type="date"
                value={irrigationInfo.nextIrrigationDate}
                onChange={(e) => setIrrigationInfo({ ...irrigationInfo, nextIrrigationDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Irrigation Notes & Timings</label>
            <textarea
              rows={2}
              value={irrigationInfo.notes}
              onChange={(e) => setIrrigationInfo({ ...irrigationInfo, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 2 hours morning drip cycle at 40 PSI pressure"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-semibold rounded-xl text-sm shadow-lg shadow-blue-950"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Irrigation Schedule'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default FarmerIrrigation;

