import React, { useEffect, useRef, useState } from 'react';
import { Plus, CheckCircle2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';

const BOUTIQUE_GALLERY_PRESETS = [
  { name: 'Midnight Silk Top', url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80' },
  { name: 'Floral Linen Dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Khadi Cotton Kurti', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Emerald Velvet Co-ord', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Sage Brocade Kaftan', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80' },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

interface AddProductFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  /** sticky footer for mobile full-screen */
  stickyActions?: boolean;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  onCancel,
  onSuccess,
  stickyActions = false,
}) => {
  const { activeCollection, collections, setIsAddDropOpen } = useAuth();
  const snackbar = useSnackbar();

  const emptySizeQty = (sizes: string[] = ALL_SIZES) =>
    Object.fromEntries(sizes.map((s) => [s, 0])) as Record<string, number>;

  const [productCollection, setProductCollection] = useState(
    activeCollection !== 'All Drops' ? activeCollection : collections[0]?.name || 'Drop 01'
  );
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Dresses');
  const [fabric] = useState('Rayon');
  const [costPrice, setCostPrice] = useState(250);
  const [sellingPrice, setSellingPrice] = useState(599);
  const [imageUrl, setImageUrl] = useState('');
  const [colorRows, setColorRows] = useState<{ color: string; size_qty: Record<string, number> }[]>([
    { color: 'Yellow', size_qty: emptySizeQty() },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([...ALL_SIZES]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeCollection && activeCollection !== 'All Drops') {
      setProductCollection(activeCollection);
    }
  }, [activeCollection, collections]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addColorRow = () => {
    const label = newColorName.trim();
    if (!label) return;
    if (colorRows.some((c) => c.color.toLowerCase() === label.toLowerCase())) {
      setNewColorName('');
      return;
    }
    setColorRows((prev) => [...prev, { color: label, size_qty: emptySizeQty(selectedSizes) }]);
    setNewColorName('');
  };

  const updateSizeQty = (colorIndex: number, size: string, qty: number) => {
    setColorRows((prev) =>
      prev.map((row, i) =>
        i === colorIndex ? { ...row, size_qty: { ...row.size_qty, [size]: Math.max(0, qty) } } : row
      )
    );
  };

  const removeColorRow = (index: number) => {
    setColorRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => {
      const next = prev.includes(size)
        ? prev.length === 1
          ? prev
          : prev.filter((s) => s !== size)
        : [...prev, size];

      setColorRows((rows) =>
        rows.map((row) => {
          const size_qty = { ...row.size_qty };
          ALL_SIZES.forEach((s) => {
            if (!next.includes(s)) delete size_qty[s];
            else if (size_qty[s] == null) size_qty[s] = 0;
          });
          return { ...row, size_qty };
        })
      );
      return next;
    });
  };

  const generateSku = () => {
    const dropPart = (productCollection.replace(/\D/g, '') || '01').padStart(2, '0');
    const namePart = (name.trim().replace(/[^a-zA-Z0-9]/g, '').slice(0, 3) || 'DRS').toUpperCase();
    const catPart = (category.trim().replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'DR').toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    setSku(`PV-D${dropPart}-${catPart}-${namePart}-${rand}`);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const validColors = colorRows.filter((c) => c.color.trim());
    if (!name.trim()) {
      snackbar.error('Enter a dress name');
      return;
    }
    if (!validColors.length) {
      snackbar.error('Add at least one color option for this dress (e.g. Yellow)');
      return;
    }
    if (!selectedSizes.length) {
      snackbar.error('Select at least one size');
      return;
    }

    setSubmitting(true);
    try {
      const generatedSku =
        sku.trim() ||
        `PV-${productCollection.replace(/\D/g, '') || '01'}-${name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      const colorsPayload = validColors.map((c) => ({
        color: c.color.trim(),
        size_qty: Object.fromEntries(
          selectedSizes.map((s) => [s, Math.max(0, Number(c.size_qty?.[s] || 0))])
        ),
      }));

      await api.post('/products', {
        name: name.trim(),
        sku: generatedSku,
        collection_id: productCollection,
        collection_name: productCollection,
        category,
        fabric,
        colors: colorsPayload,
        sizes: selectedSizes,
        cost_price: costPrice,
        selling_price: sellingPrice,
        image_url:
          imageUrl ||
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
      });

      snackbar.success(`“${name.trim()}” saved to ${productCollection}`);
      onSuccess?.();
      onCancel();
    } catch (err: any) {
      snackbar.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    'w-full min-w-0 h-11 px-3.5 border border-slate-200 rounded-xl bg-white text-[#0B162A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B162A]/10 focus:border-[#0B162A]/40';
  const labelClass = 'font-semibold text-[#0B162A] block mb-1.5';

  const actions = (
    <div className={`flex gap-3 ${stickyActions ? 'justify-between' : 'justify-end pt-4'}`}>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-3 text-slate-600 hover:text-slate-800 font-medium text-xs"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="flex-1 sm:flex-none px-6 py-3 bg-[#0B162A] text-white font-semibold rounded-xl text-xs disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Save Product'}
      </button>
    </div>
  );

  return (
    <form
      onSubmit={handleCreateProduct}
      className={`space-y-5 text-xs ${stickyActions ? 'pb-28' : ''}`}
    >
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          <label className="font-semibold text-[#0B162A] shrink min-w-0">
            Assign to Drop / Collection *
          </label>
          <button
            type="button"
            onClick={() => setIsAddDropOpen(true)}
            className="shrink-0 text-[11px] font-bold text-[#0B162A] hover:text-[#C9B7A5] whitespace-nowrap"
          >
            + Add new drop
          </button>
        </div>
        <select
          value={productCollection}
          onChange={(e) => {
            if (e.target.value === '__new_drop__') {
              setIsAddDropOpen(true);
              return;
            }
            setProductCollection(e.target.value);
          }}
          className={`${fieldClass} font-semibold`}
        >
          {collections.map((col) => (
            <option key={col.id || col._id || col.name} value={col.name}>
              {col.name} ({col.subtitle || 'Active Drop'})
            </option>
          ))}
          <option value="__new_drop__">+ Create new drop / collection…</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Dress name *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
          placeholder="e.g. Ethereal Wrap Dress"
        />
        <p className="text-[11px] text-slate-500 mt-1.5 m-0 leading-relaxed">
          Each dress has its own name, colors & sizes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label className="font-semibold text-[#0B162A]">SKU Code *</label>
            <button
              type="button"
              onClick={generateSku}
              className="text-[11px] font-bold text-[#0B162A] hover:text-[#C9B7A5]"
            >
              Auto generate
            </button>
          </div>
          <div className="flex items-stretch gap-2">
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className={`${fieldClass} flex-1`}
              placeholder="PV-D01-DRS-MSD-123"
            />
            <button
              type="button"
              onClick={generateSku}
              className="shrink-0 h-11 px-3.5 rounded-xl bg-[#0B162A] text-white text-[11px] font-bold hover:bg-[#162544] inline-flex items-center justify-center"
            >
              Auto
            </button>
          </div>
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={fieldClass}
          >
            <option value="Dresses">Dresses</option>
            <option value="Tops">Tops</option>
            <option value="Kurtis">Kurtis</option>
            <option value="Co-ords">Co-ords</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Cost Price (₹)</label>
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Selling Price (₹) *</label>
          <input
            type="number"
            required
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            className={`${fieldClass} font-bold`}
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3">
        <label className="font-semibold text-[#0B162A] block">Sizes for this dress *</label>
        <div className="flex gap-2">
          {ALL_SIZES.map((size) => {
            const on = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`flex-1 min-w-0 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  on
                    ? 'bg-[#0B162A] text-white border-[#0B162A]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="font-semibold text-[#0B162A]">Colors + qty per size *</label>
          <span className="text-[10px] text-slate-500 shrink-0">
            {colorRows.length} color{colorRows.length === 1 ? '' : 's'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 m-0 leading-relaxed">
          Set quantity for each size (e.g. Yellow XS:2, S:3, M:1).
        </p>
        <div className="space-y-3">
          {colorRows.map((row, index) => (
            <div
              key={`${row.color}-${index}`}
              className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 overflow-hidden"
            >
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={row.color}
                  onChange={(e) =>
                    setColorRows((prev) =>
                      prev.map((r, i) => (i === index ? { ...r, color: e.target.value } : r))
                    )
                  }
                  className="flex-1 min-w-0 h-10 px-3.5 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B162A]/10"
                  placeholder="Color name"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeColorRow(index)}
                  className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 disabled:opacity-30"
                  disabled={colorRows.length <= 1}
                  aria-label="Remove color"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex w-full gap-1.5 sm:gap-2">
                {selectedSizes.map((size) => (
                  <div
                    key={size}
                    className="flex-1 min-w-0 max-w-full flex flex-col items-center gap-1.5"
                  >
                    <span className="text-[10px] font-bold text-slate-500 text-center leading-none">
                      {size}
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={String(row.size_qty?.[size] ?? 0)}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '');
                        updateSizeQty(index, size, digits === '' ? 0 : Number(digits));
                      }}
                      onFocus={(e) => e.target.select()}
                      className="block w-full max-w-full min-w-0 box-border h-9 px-0 border border-slate-200 rounded-lg bg-slate-50 text-center text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B162A]/10"
                      aria-label={`${row.color || 'Color'} ${size} qty`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-stretch gap-2 pt-0.5">
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addColorRow();
              }
            }}
            className="flex-1 min-w-0 h-11 px-3.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0B162A]/10"
            placeholder="Add another color (e.g. Ivory)"
          />
          <button
            type="button"
            onClick={addColorRow}
            className="shrink-0 h-11 inline-flex items-center gap-1 px-3.5 rounded-xl bg-[#0B162A] text-white font-semibold hover:bg-[#162544]"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="font-semibold block mb-1 text-xs text-slate-700">Dress Photo from Gallery</label>
        {imageUrl ? (
          <div className="relative rounded-2xl border-2 border-[#C9B7A5]/60 overflow-hidden bg-slate-50 p-2.5 flex items-center gap-3">
            <img
              src={imageUrl}
              alt="Dress preview"
              className="w-16 h-20 object-cover rounded-xl shadow-sm border border-slate-200"
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
              </span>
              <button
                type="button"
                onClick={() => {
                  setImageUrl('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold mt-1 inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove / Choose another
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#C9B7A5] rounded-2xl p-4 text-center bg-slate-50/60 hover:bg-slate-50 transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#C9B7A5]" />
            </div>
            <p className="text-xs font-semibold text-[#0B162A]">Upload photo from gallery</p>
            <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, or WEBP</p>
          </div>
        )}

        <div className="mt-3">
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1.5">
            <ImageIcon className="w-3 h-3 text-[#C9B7A5]" /> Or choose from brand gallery:
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {BOUTIQUE_GALLERY_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all h-14 ${
                  imageUrl === preset.url
                    ? 'border-[#0B162A] ring-2 ring-[#C9B7A5]'
                    : 'border-transparent hover:border-slate-300'
                }`}
                title={preset.name}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {stickyActions ? (
        <div className="fixed inset-x-0 bottom-[4.75rem] z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-5 py-3 shadow-[0_-8px_30px_rgba(15,27,52,0.08)] lg:hidden">
          <div className="max-w-lg mx-auto">{actions}</div>
        </div>
      ) : (
        actions
      )}
    </form>
  );
};
