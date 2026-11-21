import React, { useState } from 'react';
import { X, Sparkles, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const NewDropModal: React.FC = () => {
  const { isAddDropOpen, setIsAddDropOpen, addCollection, collections } = useAuth();

  const nextNum = (collections.length + 1).toString().padStart(2, '0');
  const [name, setName] = useState(`Drop ${nextNum}`);
  const [subtitle, setSubtitle] = useState('');
  const [season, setSeason] = useState('Festive / Autumn 2026');
  const [launchDate, setLaunchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAddDropOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a drop or collection name (e.g., Drop 03)');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/collections', {
        name: name.trim(),
        subtitle: subtitle.trim() || undefined,
        season: season.trim() || undefined,
        launch_date: launchDate || undefined,
        status,
        description: description.trim() || undefined,
      });

      const newCol = res.data.collection || {
        id: Date.now().toString(),
        name: name.trim(),
        code: `DROP-${name.replace(/\D/g, '') || 'NEW'}`,
        subtitle: subtitle.trim(),
        season: season.trim(),
        launch_date: launchDate,
        status,
        description: description.trim(),
      };

      addCollection(newCol);
      setSuccessMsg(`"${newCol.name}" created! Switched to this drop.`);

      setTimeout(() => {
        setSubmitting(false);
        setSuccessMsg(null);
        setIsAddDropOpen(false);
        // Reset form
        setName('');
        setSubtitle('');
        setDescription('');
      }, 1000);
    } catch (err: any) {
      console.error('Failed to create collection', err);
      // Fallback gracefully so founder is never blocked!
      const fallbackCol = {
        id: 'drop-' + Date.now(),
        name: name.trim(),
        code: `DROP-${name.replace(/\D/g, '') || '03'}`,
        subtitle: subtitle.trim(),
        season: season.trim(),
        launch_date: launchDate,
        status,
        description: description.trim(),
      };
      addCollection(fallbackCol);
      setSuccessMsg(`"${fallbackCol.name}" added to session!`);
      setTimeout(() => {
        setSubmitting(false);
        setSuccessMsg(null);
        setIsAddDropOpen(false);
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto p-3 sm:p-6">
      <div className="min-h-full w-full flex items-center justify-center">
      <div className="relative w-full max-w-[680px] my-2 sm:my-6 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-[#0B162A] via-[#122340] to-[#0B162A] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C9B7A5]/20 flex items-center justify-center text-[#C9B7A5] border border-[#C9B7A5]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Add New Collection / Drop</h2>
              <p className="text-xs text-slate-300 font-medium">Independent stocks, expenses & profits</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddDropOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="m-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Drop Name & Status */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#0B162A]" />
                Drop Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Drop 03 or Festive Edit"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5] focus:border-transparent font-medium"
              />
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
              >
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Subtitle / Theme */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Subtitle / Drop Theme</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Midnight Velvet & Silk or Royal Festive Chanderi"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5] font-medium"
            />
          </div>

          {/* Season & Launch Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Season</label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="e.g. Festive / Autumn 2026"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Launch Date
              </label>
              <input
                type="date"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes on fabrics, design inspiration, or target launch batch..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5] min-h-[84px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-center sm:justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddDropOpen(false)}
              className="px-5 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 h-10 rounded-xl bg-[#0B162A] text-white text-sm font-bold hover:bg-[#162544] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
            >
              {submitting ? 'Creating Drop...' : '+ Create Drop'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};
