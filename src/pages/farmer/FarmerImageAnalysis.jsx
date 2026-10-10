import React, { useState } from 'react';
import { imageAnalysisService } from '../../services/imageAnalysisService';
import Alert from '../../components/Alert';
import { Camera, UploadCloud, CheckCircle2, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';

const FarmerImageAnalysis = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10 MB');
      return;
    }

    setError('');
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file to upload');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await imageAnalysisService.analyzeImage(file);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to analyze crop image via MobileNetV2 AI model');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-gradient-to-r from-purple-950/70 to-slate-900/80 p-6 rounded-3xl border border-purple-900/50">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-purple-400" /> PyTorch Crop Disease Neural Scanner
        </h2>
        <p className="text-slate-300 text-sm mt-1">Upload a leaf or foliage photo to perform real-time MobileNetV2 image classification</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleAnalyze} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Upload Plant Image</label>

          <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/60 relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {previewUrl ? (
              <div className="space-y-2">
                <img src={previewUrl} alt="Crop Preview" className="max-h-48 rounded-xl mx-auto shadow-md object-cover" />
                <p className="text-xs text-slate-400 font-medium truncate">{file?.name}</p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <UploadCloud className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-white">Click or drag image file here</p>
                <p className="text-xs text-slate-500">Supports JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-950 transition-all disabled:opacity-50"
          >
            {loading ? 'Running PyTorch MobileNetV2 Inference...' : <><span>Run Neural Analysis</span><Sparkles className="w-4 h-4" /></>}
          </button>
        </form>

        <div>
          {result ? (
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-emerald-500/40 shadow-xl space-y-4">
              {previewUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                  <img src={previewUrl} alt="Analyzed Leaf" className="w-full max-h-48 object-cover rounded-lg" />
                </div>
              )}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Detected Condition</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {result.disease?.replace(/_/g, ' ')}
                  </h3>
                </div>
                {result.confidence && (
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full font-bold text-xs">
                    {result.confidence.toFixed(1)}% Confidence
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 text-xs uppercase mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" /> Recommended Remedy & Action Plan
                </h4>
                <p className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                  {result.recommendation}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-8 flex flex-col items-center justify-center text-center">
              <ImageIcon className="w-12 h-12 text-slate-700 mb-3" />
              <h4 className="text-base font-semibold text-white">No Image Analyzed Yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Select a crop leaf photo on the left and click 'Run Neural Analysis' to get instant diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerImageAnalysis;

