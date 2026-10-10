import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Alert from '../../components/Alert';
import { BookOpen, Plus, Trash2, Tag, X, Save, Sparkles } from 'lucide-react';

const AdminKnowledge = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'CROP_MANAGEMENT',
    content: '',
    source: 'ICAR Bulletin',
  });

  const fetchDocuments = async () => {
    try {
      const data = await adminService.getKnowledgeDocuments();
      setDocuments(data);
    } catch (err) {
      setError('Failed to load RAG knowledge base documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document from the RAG index?')) return;
    try {
      await adminService.deleteKnowledgeDocument(id);
      setMessage('Knowledge document deleted and unindexed from RAG');
      fetchDocuments();
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await adminService.addKnowledgeDocument(formData);
      setMessage('Document uploaded, chunked, and indexed into RAG vector engine successfully!');
      setShowModal(false);
      setFormData({ title: '', category: 'CROP_MANAGEMENT', content: '', source: 'ICAR Bulletin' });
      fetchDocuments();
    } catch (err) {
      setError('Failed to index knowledge document');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" /> RAG Knowledge Base Administration
          </h2>
          <p className="text-slate-400 text-sm mt-1">Upload and manage agricultural guidelines indexed by the AI Farm Assistant chatbot</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-950 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload & Index Document</span>
        </button>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <div className="text-slate-400 text-sm p-6">Loading RAG knowledge documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No knowledge documents indexed</h3>
          <p className="text-slate-400 text-sm mt-1">Upload agricultural manuals or pest treatment guides to activate AI chatbot search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{doc.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 shrink-0">
                    {doc.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {doc.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 font-medium">Source: {doc.source || 'Admin'}</span>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 rounded-lg border border-rose-800/50"
                  title="Unindex & Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Upload & Index Agricultural Document</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Cotton Bollworm Prevention & Organic Spray Guidelines"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CROP_MANAGEMENT">Crop Management</option>
                    <option value="SOIL_HEALTH">Soil Health & Nutrients</option>
                    <option value="DISEASE_MANAGEMENT">Disease & Pest Treatment</option>
                    <option value="IRRIGATION">Irrigation Practices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Source Reference</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="ICAR / Agriculture Extension"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Document Content (Auto-Chunked into Vector Engine) *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                  placeholder="Paste complete agricultural research or treatment instructions..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950">
                  <Sparkles className="w-4 h-4" /> Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKnowledge;

