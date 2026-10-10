import React, { useState, useEffect } from 'react';
import { imageAnalysisService } from '../../services/imageAnalysisService';
import Alert from '../../components/Alert';
import { History, Camera, Search } from 'lucide-react';

const FarmerHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await imageAnalysisService.getHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to load scan history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) =>
    item.disease?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.imageName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" /> Disease Scan History
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review historical MobileNetV2 diagnosis reports and remedies</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by disease or filename..."
            className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
          />
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <div className="text-slate-400 text-sm p-6">Loading scan records...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No disease scan history found</h3>
          <p className="text-slate-400 text-sm mt-1">Uploaded images will appear here with confidence scores and treatments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{item.disease?.replace(/_/g, ' ')}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">File: {item.imageName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-950 text-purple-400 border border-purple-800/60 rounded-full font-bold text-xs">
                    {item.confidence?.toFixed(1)}% Confidence
                  </span>
                  <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Recommended Treatment</p>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {item.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerHistory;

