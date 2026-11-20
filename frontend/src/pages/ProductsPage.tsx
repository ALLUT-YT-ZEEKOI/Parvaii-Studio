import React, { useEffect, useState, useRef } from 'react';
import { Tag, Plus, Search, Filter, Layers, CheckCircle2, Upload, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { getProductsForDrop } from '../services/dropData';

const BOUTIQUE_GALLERY_PRESETS = [
  { name: 'Midnight Silk Top', url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80' },
  { name: 'Floral Linen Dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Khadi Cotton Kurti', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Emerald Velvet Co-ord', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Sage Brocade Kaftan', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80' },
];


export const ProductsPage: React.FC = () => {
  const { activeCollection, setActiveCollection, collections } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New product state
  const [productCollection, setProductCollection] = useState(activeCollection !== 'All Drops' ? activeCollection : 'Drop 02');
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Dresses');
  const [fabric, setFabric] = useState('Rayon');
  const [costPrice, setCostPrice] = useState(250);
  const [sellingPrice, setSellingPrice] = useState(599);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [activeCollection]);

  const loadProducts = () => {
    const params: Record<string, string> = {};
    if (activeCollection && activeCollection !== 'All Drops') {
      params.collection_id = activeCollection;
    }

    api.get('/products', { params })
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => {
        setProducts([]);
      });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedSku = sku.trim() || `PV-${productCollection.replace(/\D/g, '') || '02'}-${name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      await api.post('/products', {
        name,
        sku: generatedSku,
        collection_id: productCollection,
        collection_name: productCollection,
        category,
        fabric,
        cost_price: costPrice,
        selling_price: sellingPrice,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
      });
      setIsAddOpen(false);
      setName('');
      setSku('');
      loadProducts();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to create product');
    }
  };

  const filtered = products.filter((p) => {
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Active Drop Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9B7A5]"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing Silhouettes For:
          </span>
          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            {activeCollection}
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            ({filtered.length} product{filtered.length === 1 ? '' : 's'})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['Drop 01', 'Drop 02', 'All Drops'].map((drop) => (
            <button
              key={drop}
              type="button"
              onClick={() => setActiveCollection(drop)}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${activeCollection === drop
                ? 'bg-[#0B162A] text-white shadow-sm ring-2 ring-[#C9B7A5]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
            >
              {drop}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Product Catalog</h2>
          <p className="text-xs text-slate-500">Collection silhouettes, fabric blends & multi-size variant stocks</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B162A] text-white rounded-xl text-xs font-semibold hover:bg-[#162544] shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dress</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-card flex items-center justify-between">
        <span className="text-xs font-semibold text-[#0B162A]">All Active Garments</span>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by dress name, SKU..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Tag className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-700 text-sm">No Products in {activeCollection}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Click &quot;Add New Dress&quot; above to start designing and stocking your collection.</p>
          </div>
        ) : (
          filtered.map((product) => {
            const margin = product.cost_price_inr
              ? Math.round(((product.selling_price_inr - product.cost_price_inr) / product.selling_price_inr) * 100)
              : 55;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card hover:shadow-card-hover overflow-hidden transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#0B162A]/90 text-white backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-bold text-[#0B162A]">{product.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{product.sku} • {product.fabric || 'Cotton Blend'}</p>

                    <div className="flex items-center justify-between mt-3 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Selling Price</span>
                        <span className="text-base font-extrabold text-[#0B162A]">₹{product.selling_price_inr}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Cost Price</span>
                        <span className="text-xs font-semibold text-slate-600">₹{product.cost_price_inr || 200}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Profit Margin</span>
                        <span className="text-xs font-bold text-emerald-600">{margin}%</span>
                      </div>
                    </div>

                    {/* Size Stock Badges */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Sizes Available
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Available Inventory:</span>
                <span className="font-bold text-[#0B162A]">{product.available_stock ?? 0} pieces</span>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-[#0B162A] mb-3">Add Product to Collection</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Assign to Drop / Collection *</label>
                <select
                  value={productCollection}
                  onChange={(e) => setProductCollection(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white font-semibold text-[#0B162A]"
                >
                  {collections.map((col) => (
                    <option key={col.id || col._id || col.name} value={col.name}>
                      {col.name} ({col.subtitle || 'Active Drop'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Product / Dress Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="e.g. Midnight Silk Dress"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="PV-DR02-MSD"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Kurtis">Kurtis</option>
                    <option value="Co-ords">Co-ords</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-xs text-slate-700">
                  Dress Photo from Gallery
                </label>

                {imageUrl ? (
                  <div className="relative rounded-2xl border-2 border-[#C9B7A5]/60 overflow-hidden bg-slate-50 p-2.5 flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Dress preview"
                      className="w-16 h-20 object-cover rounded-xl shadow-sm border border-slate-200"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached from Gallery
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Ready to publish with garment</p>
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
                    className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#C9B7A5] rounded-2xl p-4 text-center bg-slate-50/60 hover:bg-slate-50 transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#0B162A] group-hover:scale-105 transition-all">
                      <Upload className="w-5 h-5 text-[#C9B7A5]" />
                    </div>
                    <p className="text-xs font-semibold text-[#0B162A]">
                      Click to upload photo from your device gallery
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Select PNG, JPG, or WEBP from phone, camera or local files
                    </p>
                  </div>
                )}

                {/* Boutique Gallery Presets */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-[#C9B7A5]" /> Or choose from brand dress gallery:
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {BOUTIQUE_GALLERY_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all group h-14 ${imageUrl === preset.url
                          ? 'border-[#0B162A] ring-2 ring-[#C9B7A5]'
                          : 'border-transparent hover:border-slate-300'
                          }`}
                        title={preset.name}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white font-medium truncate px-1 py-0.5 text-center">
                          {preset.name.split(' ')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B162A] text-white font-semibold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

