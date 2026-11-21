import React, { useEffect, useState } from 'react';
import { X, Pencil, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { api } from '../../services/api';
import { Collection } from '../../types';
import { DROP_CATEGORIES } from '../../constants/dropCategories';

interface EditDropModalProps {
  drop: Collection | null;
  onClose: () => void;
}

export const EditDropModal: React.FC<EditDropModalProps> = ({ drop, onClose }) => {
  const { updateCollection, activeCollection, setActiveCollection } = useAuth();
  const snackbar = useSnackbar();

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Dresses');
  const [code, setCode] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!drop) return;
    setName(drop.name || '');
    setSubtitle(drop.subtitle || '');
    setCategory(drop.category || 'Dresses');
    setCode(drop.code || '');
    setLaunchDate(drop.launch_date || '');
    setStatus(drop.status || 'active');
    setDescription(drop.description || '');
    setError(null);
    setSuccessMsg(null);
  }, [drop]);

  if (!drop) return null;

  const dropId = String(drop.id || drop._id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Drop name is required');
      return;
    }
    if (!dropId) {
      setError('Cannot edit this drop — missing id');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.patch(`/collections/${dropId}`, {
        name: name.trim(),
        subtitle: subtitle.trim(),
        category,
        code: code.trim() || undefined,
        launch_date: launchDate || undefined,
        status,
        description: description.trim(),
      });

      const updated = res.data.collection || {
        ...drop,
        name: name.trim(),
        subtitle: subtitle.trim(),
        category,
        code: code.trim() || drop.code,
        launch_date: launchDate,
        status,
        description: description.trim(),
      };

      const oldName = drop.name;
      updateCollection(updated, oldName);

      if (activeCollection === oldName) {
        setActiveCollection(updated.name);
      }

      snackbar.success(`“${updated.name}” updated`);
      setSubmitting(false);
      onClose();
    } catch (err: any) {
      setSubmitting(false);
      const msg = err.response?.data?.message || err.message || 'Failed to update drop';
      setError(msg);
      snackbar.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto p-3 sm:p-6">
      <div className="min-h-full w-full flex items-center justify-center">
        <div className="relative w-full max-w-[680px] my-2 sm:my-6 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-[#0B162A] via-[#122340] to-[#0B162A] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C9B7A5]/20 flex items-center justify-center text-[#C9B7A5] border border-[#C9B7A5]/30">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight">Edit Drop / Collection</h2>
                <p className="text-xs text-slate-300 font-medium">Change name, season, theme & status</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {successMsg && (
            <div className="m-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

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
                  placeholder="e.g. Drop 01 or Ethereal Dawn Drop"
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Subtitle / Theme Name</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Ethereal Dawn"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5] font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
                >
                  {DROP_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="DROP-01"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5] font-medium uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notes about this drop..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5] min-h-[84px]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 h-10 rounded-xl bg-[#0B162A] text-white text-sm font-bold hover:bg-[#162544] transition-colors disabled:opacity-60"
              >
                {submitting ? 'Saving...' : 'Save Drop Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
