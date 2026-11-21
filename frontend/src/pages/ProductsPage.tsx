import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { AddProductForm } from '../components/products/AddProductForm';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeCollection, setActiveCollection, collections } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [activeCollection]);

  const loadProducts = () => {
    const params: Record<string, string> = {};
    if (activeCollection && activeCollection !== 'All Drops') {
      params.collection_id = activeCollection;
    }

    api
      .get('/products', { params })
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]));
  };

  const openAddDress = () => {
    // Mobile: separate full screen. Desktop: keep modal flow.
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      navigate('/products/new');
      return;
    }
    setIsAddOpen(true);
  };

  const filtered = products.filter((p) => {
    if (!search) return true;
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9B7A5]" />
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
          {['All Drops', ...collections.map((c) => c.name)]
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((drop) => (
              <button
                key={drop}
                type="button"
                onClick={() => setActiveCollection(drop)}
                className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeCollection === drop
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
          <p className="text-xs text-slate-500">
            Collection silhouettes, fabric blends & multi-size variant stocks
          </p>
        </div>

        <button
          onClick={openAddDress}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B162A] text-white rounded-xl text-xs font-semibold hover:bg-[#162544] shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C9B7A5]" />
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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <p className="text-sm font-semibold text-[#0B162A]">No dresses in this drop yet</p>
          <p className="text-xs text-slate-500 mt-1">Add your first dress with colors & sizes.</p>
          <button
            type="button"
            onClick={openAddDress}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0B162A] text-white rounded-xl text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add New Dress
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((product) => {
            const margin =
              product.selling_price_inr && product.cost_price_inr
                ? Math.round(
                    ((product.selling_price_inr - product.cost_price_inr) / product.selling_price_inr) *
                      100
                  )
                : 55;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card hover:shadow-card-hover overflow-hidden transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={
                        product.image_url ||
                        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#0B162A]/90 text-white backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-bold text-[#0B162A]">{product.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {product.sku} • {product.fabric || 'Cotton Blend'}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Selling Price</span>
                        <span className="text-base font-extrabold text-[#0B162A]">
                          ₹{product.selling_price_inr}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Cost Price</span>
                        <span className="text-xs font-semibold text-slate-600">
                          ₹{product.cost_price_inr || 200}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Profit Margin</span>
                        <span className="text-xs font-bold text-emerald-600">{margin}%</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Color Options
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(
                          new Set(
                            (product.variants || [])
                              .map((v: any) => v.color)
                              .filter(Boolean)
                              .concat(product.color ? [product.color] : [])
                          )
                        ).map((c: any) => {
                          const colorStock = (product.variants || [])
                            .filter((v: any) => (v.color || 'Default') === c)
                            .reduce((s: number, v: any) => s + (v.available_stock || 0), 0);
                          return (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200"
                            >
                              {c}
                              {colorStock ? ` · ${colorStock}` : ''}
                            </span>
                          );
                        })}
                        {!(product.variants || []).some((v: any) => v.color) && !product.color && (
                          <span className="text-[11px] text-slate-400">No colors yet</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-3 mb-1.5">
                        Sizes
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.from(
                          new Set((product.variants || []).map((v: any) => v.size).filter(Boolean))
                        ).length
                          ? Array.from(
                              new Set((product.variants || []).map((v: any) => v.size).filter(Boolean))
                            )
                          : ['XS', 'S', 'M', 'L', 'XL']
                        ).map((s: any) => (
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
                  <span className="font-bold text-[#0B162A]">
                    {product.available_stock ?? 0} pieces
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Desktop modal only */}
      {isAddOpen && (
        <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg px-6 py-6 sm:px-7 sm:py-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-[#0B162A] mb-5 pr-8">Add Product to Collection</h3>
            <AddProductForm
              onCancel={() => setIsAddOpen(false)}
              onSuccess={() => {
                setIsAddOpen(false);
                loadProducts();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
