import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '../types';
import { fetchCuisineList, fetchDishesByCuisine, updateDish } from '../services/supabaseService';

interface DishBankProps {
  userRole?: 'admin' | 'staff' | null;
}

export const DishBank: React.FC<DishBankProps> = ({ userRole }) => {
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [dishes, setDishes] = useState<Record<string, MenuItem[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCuisines, setIsLoadingCuisines] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit State
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState<{ name: string, description: string, cuisine: string }>({ name: '', description: '', cuisine: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Load cuisines from Supabase
  useEffect(() => {
    const loadCuisines = async () => {
      setIsLoadingCuisines(true);
      try {
        const list = await fetchCuisineList();
        setCuisines(list);
        setSelectedCuisine((prev) => (prev && list.includes(prev) ? prev : (list[0] ?? '')));
      } catch (err) {
        console.error('Failed to load cuisines:', err);
        setCuisines([]);
        setSelectedCuisine('');
      } finally {
        setIsLoadingCuisines(false);
      }
    };

    loadCuisines();
  }, []);

  // Load dishes when cuisine changes
  useEffect(() => {
    if (!selectedCuisine) {
      setDishes({});
      return;
    }

    const loadDishes = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDishesByCuisine(selectedCuisine);
        setDishes(data);
      } catch (err) {
        console.error('Failed to load dishes:', err);
        setDishes({});
      } finally {
        setIsLoading(false);
      }
    };

    loadDishes();
  }, [selectedCuisine]);

  const categories = useMemo(() => Object.keys(dishes), [dishes]);
  const q = searchTerm.trim().toLowerCase();

  const openEditModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setEditForm({
      name: dish.name,
      description: dish.description,
      cuisine: selectedCuisine // Default to current, but allow change
    });
  };

  const handleSaveDish = async () => {
    if (!editingDish || !editingDish.id) return;
    setIsSaving(true);
    try {
      await updateDish(editingDish.id, {
        name: editForm.name,
        description: editForm.description
      }, editForm.cuisine !== selectedCuisine ? editForm.cuisine : undefined);

      // Refresh data
      // If cuisine changed, we might need to remove it from local state or just reload.
      // Easiest is to reload the current cuisine's dishes.
      const data = await fetchDishesByCuisine(selectedCuisine);
      setDishes(data);
      setEditingDish(null);
    } catch (e) {
      console.error("Failed to update dish", e);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800">Dish Library</h2>
          <p className="text-slate-500 text-sm">Browse our curated collection of regional specialties.</p>
        </div>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {isLoadingCuisines ? (
            <div className="px-4 py-2 text-xs font-bold text-slate-400">Loading cuisines…</div>
          ) : cuisines.length === 0 ? (
            <div className="px-4 py-2 text-xs font-bold text-slate-400">No cuisines found</div>
          ) : (
            cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${selectedCuisine === c ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                {c}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search for a dish (e.g. 'Paneer' or 'Pasta')..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={!selectedCuisine}
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const list = dishes[category] ?? [];
            const filtered = q
              ? list.filter((d) => {
                const name = (d.name ?? '').toLowerCase();
                const desc = (d.description ?? '').toLowerCase();
                return name.includes(q) || desc.includes(q);
              })
              : list;

            if (filtered.length === 0) return null;

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-bold text-slate-800 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((dish, idx) => (
                    <div
                      key={`${category}-${dish.name}-${idx}`}
                      className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all cursor-default"
                    >
                      <div className="flex justify-between items-start mb-2 gap-3">
                        <h4 className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                          {dish.name}
                        </h4>

                        {!!dish.dietaryTags?.length && (
                          <div className="flex gap-1 flex-wrap justify-end">
                            {dish.dietaryTags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border bg-slate-50 text-slate-400 border-slate-100 uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-slate-500 text-xs leading-relaxed italic line-clamp-2 flex-1">
                          {dish.description || '—'}
                        </p>
                        {userRole === 'admin' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(dish); }}
                            className="ml-2 p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all"
                            title="Edit Dish"
                          >
                            ✏️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* Edit Modal */}
      {editingDish && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Edit Dish</h3>
              <button
                onClick={() => setEditingDish(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dish Name</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cuisine Category</label>
                <select
                  value={editForm.cuisine}
                  onChange={e => setEditForm({ ...editForm, cuisine: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500/20 outline-none appearance-none"
                >
                  {cuisines.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 italic">Moving cuisine will remove it from the current view after save.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button
                onClick={() => setEditingDish(null)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDish}
                disabled={isSaving}
                className="px-6 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-200 transition-all flex items-center space-x-2"
              >
                {isSaving ? <span>Saving...</span> : <span>Save Changes</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
