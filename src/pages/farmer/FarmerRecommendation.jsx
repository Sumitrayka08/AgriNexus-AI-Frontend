import React, { useState } from 'react';
import { recommendationService } from '../../services/recommendationService';
import Alert from '../../components/Alert';
import { Sparkles, CheckCircle2, Sprout, Compass, Lightbulb } from 'lucide-react';

const FarmerRecommendation = () => {
  const [formData, setFormData] = useState({
    soilType: 'Loamy',
    ph: '6.5',
    nitrogen: '90',
    phosphorus: '42',
    potassium: '43',
    temperature: '26',
    humidity: '75',
    rainfall: '200',
    location: '',
    season: 'Kharif',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    const payload = {
      soilType: formData.soilType,
      ph: parseFloat(formData.ph),
      nitrogen: parseFloat(formData.nitrogen),
      phosphorus: parseFloat(formData.phosphorus),
      potassium: parseFloat(formData.potassium),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      rainfall: parseFloat(formData.rainfall),
      location: formData.location,
      season: formData.season,
    };

    try {
      const response = await recommendationService.recommendCrop(payload);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate crop recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900/80 p-6 rounded-3xl border border-emerald-900/50">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-400" /> AI Crop Recommendation Advisory
        </h2>
        <p className="text-slate-300 text-sm mt-1">Input your soil nutrients and environmental parameters to receive optimal crop predictions</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Agronomic Parameters</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Soil Type</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              >
                <option value="Loamy">Loamy</option>
                <option value="Alluvial">Alluvial</option>
                <option value="Black Cotton">Black Cotton</option>
                <option value="Red Soil">Red Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Season</label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-emerald-400 mb-1">Nitrogen (N)</label>
              <input
                type="number"
                required
                value={formData.nitrogen}
                onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-400 mb-1">Phosphorus (P)</label>
              <input
                type="number"
                required
                value={formData.phosphorus}
                onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-400 mb-1">Potassium (K)</label>
              <input
                type="number"
                required
                value={formData.potassium}
                onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Soil pH (0 - 14)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.ph}
                onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Temperature (°C)</label>
              <input
                type="number"
                required
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Humidity (%)</label>
              <input
                type="number"
                required
                value={formData.humidity}
                onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Annual Rainfall (mm)</label>
              <input
                type="number"
                required
                value={formData.rainfall}
                onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-950 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Evaluating Agronomic Rules...' : <><span>Generate Recommendation</span><Sparkles className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="space-y-4">
          {result ? (
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Optimal Recommended Crop</span>
                  <h3 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
                    <Sprout className="w-8 h-8 text-emerald-400" /> {result.recommendedCrop}
                  </h3>
                </div>
                {result.confidenceScore && (
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full font-bold text-xs">
                    {result.confidenceScore.toFixed(1)}% Match
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Compass className="w-4 h-4 text-emerald-400" /> Agronomic Rationale
                  </h4>
                  <p className="text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {result.reason}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> Cultivation Guidance
                  </h4>
                  <p className="text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {result.guidance}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-8 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-12 h-12 text-slate-700 mb-3" />
              <h4 className="text-base font-semibold text-white">No Recommendation Generated Yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Fill out the soil nutrients and rainfall parameters on the left, then click 'Generate Recommendation'.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerRecommendation;

