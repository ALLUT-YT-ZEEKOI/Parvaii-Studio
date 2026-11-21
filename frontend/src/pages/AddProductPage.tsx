import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AddProductForm } from '../components/products/AddProductForm';

/** Mobile full-screen add-dress flow (desktop keeps modal on Products page) */
export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => navigate('/products');

  return (
    <div className="min-h-[calc(100vh-8rem)] -mx-3.5 px-4 sm:mx-0 sm:px-0 sm:min-h-0">
      {/* Mobile screen header */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3.5 mb-4 bg-[#F8F9FC]/95 backdrop-blur-md border-b border-slate-200/80 sm:mx-0 sm:px-0 sm:rounded-2xl sm:border sm:bg-white sm:px-5">
        <div className="flex items-center gap-3.5 max-w-lg mx-auto sm:max-w-none">
          <button
            type="button"
            onClick={goBack}
            className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0B162A] shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-[17px] font-bold text-[#0B162A] m-0 leading-tight">Add New Dress</h1>
            <p className="text-[11px] text-slate-500 m-0 mt-0.5">Name, sizes, colors & photo</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto sm:max-w-none bg-white rounded-2xl border border-slate-200/90 shadow-card px-5 py-5 sm:p-6">
        <AddProductForm onCancel={goBack} onSuccess={goBack} stickyActions />
      </div>
    </div>
  );
};
