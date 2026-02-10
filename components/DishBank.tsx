import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '../types';
import { fetchCuisineList, fetchDishesByCuisine, updateDish, addSubMenuItem, updateSubMenuItem, deleteSubMenuItem, addDishToLibrary, deleteDish } from '../services/supabaseService';

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
  const [isManagingSubMenu, setIsManagingSubMenu] = useState(false);
  const [newSubMenuItem, setNewSubMenuItem] = useState({ name: '', description: '', dietaryTags: [] as string[] });

  // Add Dish State
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [addDishForm, setAddDishForm] = useState({
    name: '',
    description: '',
    cuisine: '',
    category: '',
    dietaryTags: [] as string[],
    subMenuItems: [] as Array<{ name: string, description: string, dietaryTags: string[] }>
  });
  const [newSubMenuItemForAdd, setNewSubMenuItemForAdd] = useState({ name: '', description: '', dietaryTags: [] as string[] });

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

  const handleAddDish = async () => {
    // Validation
    if (!addDishForm.name.trim()) {
      alert('Please enter a dish name');
      return;
    }
    if (!addDishForm.cuisine) {
      alert('Please select a cuisine');
      return;
    }
    if (!addDishForm.category) {
      alert('Please select a category');
      return;
    }

    setIsSaving(true);
    try {
      const newDish: MenuItem = {
        name: addDishForm.name.trim(),
        description: addDishForm.description.trim(),
        dietaryTags: addDishForm.dietaryTags
      };

      await addDishToLibrary(addDishForm.cuisine, addDishForm.category, newDish);

      // Refresh dishes if the added dish is in the currently selected cuisine
      if (addDishForm.cuisine === selectedCuisine || selectedCuisine === 'Any / Mix') {
        const data = await fetchDishesByCuisine(selectedCuisine);
        setDishes(data);
      }

      // Reset form and close modal
      setAddDishForm({
        name: '',
        description: '',
        cuisine: '',
        category: '',
        dietaryTags: []
      });
      setIsAddingDish(false);
      alert('Dish added successfully!');
    } catch (e) {
      console.error('Failed to add dish', e);
      alert('Failed to add dish. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDietaryTag = (tag: string, isAddForm: boolean = false) => {
    if (isAddForm) {
      setAddDishForm(prev => ({
        ...prev,
        dietaryTags: prev.dietaryTags.includes(tag)
          ? prev.dietaryTags.filter(t => t !== tag)
          : [...prev.dietaryTags, tag]
      }));
    }
  };

  const handleDeleteDish = async (dishId: string, dishName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${dishName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDish(dishId);
      // Refresh dishes
      const data = await fetchDishesByCuisine(selectedCuisine);
      setDishes(data);
    } catch (e) {
      console.error('Failed to delete dish', e);
      alert('Failed to delete dish. Please try again.');
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
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(dish); }}
                              className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all"
                              title="Edit Dish"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteDish(dish.id || '', dish.name); }}
                              className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Dish"
                            >
                              🗑️
                            </button>
                          </div>
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

              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sub-Menu Items</label>
                  <button
                    onClick={() => setIsManagingSubMenu(!isManagingSubMenu)}
                    className="text-[10px] font-black uppercase tracking-widest text-teal-600 hover:text-teal-700"
                  >
                    {isManagingSubMenu ? 'Done' : '+ Add Options'}
                  </button>
                </div>

                <div className="space-y-2">
                  {editingDish.subMenuItems?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-800">{item.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{item.description}</div>
                      </div>
                      <button
                        onClick={async () => {
                          if (item.id) {
                            await deleteSubMenuItem(item.id);
                            // Refresh
                            const data = await fetchDishesByCuisine(selectedCuisine);
                            setDishes(data);
                            const updatedDish = Object.values(data).flat().find(d => d.id === editingDish.id);
                            if (updatedDish) setEditingDish(updatedDish);
                          }
                        }}
                        className="ml-2 text-slate-400 hover:text-red-500"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}

                  {isManagingSubMenu && (
                    <div className="bg-teal-50/50 p-4 rounded-xl border-2 border-dashed border-teal-200 space-y-3">
                      <input
                        placeholder="Option Name (e.g. 'Penne Pasta')"
                        className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-xs font-semibold outline-none"
                        value={newSubMenuItem.name}
                        onChange={e => setNewSubMenuItem({ ...newSubMenuItem, name: e.target.value })}
                      />
                      <textarea
                        placeholder="Short description..."
                        className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-xs outline-none resize-none"
                        value={newSubMenuItem.description}
                        onChange={e => setNewSubMenuItem({ ...newSubMenuItem, description: e.target.value })}
                        rows={2}
                      />
                      <button
                        onClick={async () => {
                          if (editingDish.id && newSubMenuItem.name) {
                            await addSubMenuItem(editingDish.id, { ...newSubMenuItem, dietaryTags: [] });
                            setNewSubMenuItem({ name: '', description: '', dietaryTags: [] });
                            // Refresh
                            const data = await fetchDishesByCuisine(selectedCuisine);
                            setDishes(data);
                            const updatedDish = Object.values(data).flat().find(d => d.id === editingDish.id);
                            if (updatedDish) setEditingDish(updatedDish);
                          }
                        }}
                        className="w-full bg-teal-600 text-white font-bold py-2 rounded-lg text-xs shadow-md"
                      >
                        Add to Sub-Menu
                      </button>
                    </div>
                  )}
                </div>
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

      {/* Floating Add Dish Button (Admin Only) */}
      {userRole === 'admin' && (
        <button
          onClick={() => {
            setAddDishForm({
              name: '',
              description: '',
              cuisine: selectedCuisine || cuisines[0] || '',
              category: '',
              dietaryTags: []
            });
            setIsAddingDish(true);
          }}
          className="fixed top-20 right-8 w-32 h-16 bg-gradient-to-r from-teal-600 to-violet-600 text-white rounded-full shadow-2xl hover:shadow-teal-300 flex items-center justify-center text-xl transition-all hover:scale-110 z-50"
          title="Add New Dish"
        >
          Add Dish
        </button>
      )}

      {/* Add Dish Modal */}
      {isAddingDish && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-600 to-violet-600 p-8 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black italic">Add New Dish 🍽️</h3>
                <button
                  onClick={() => setIsAddingDish(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-lg"
                >
                  ✕
                </button>
              </div>
              <p className="text-white/80 font-medium italic text-sm mt-2">
                Create a new dish for your menu library
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* Dish Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Dish Name *</label>
                <input
                  type="text"
                  value={addDishForm.name}
                  onChange={(e) => setAddDishForm({ ...addDishForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-teal-50/30 border-2 border-teal-50 rounded-xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="e.g., Butter Chicken"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                <textarea
                  value={addDishForm.description}
                  onChange={(e) => setAddDishForm({ ...addDishForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-teal-50/30 border-2 border-teal-50 rounded-xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium min-h-[80px]"
                  placeholder="Describe the dish..."
                />
              </div>

              {/* Cuisine */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Cuisine *</label>
                <select
                  value={addDishForm.cuisine}
                  onChange={(e) => setAddDishForm({ ...addDishForm, cuisine: e.target.value })}
                  className="w-full px-4 py-3 bg-teal-50/30 border-2 border-teal-50 rounded-xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium"
                >
                  <option value="">Select Cuisine</option>
                  {cuisines.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Category *</label>
                <select
                  value={addDishForm.category}
                  onChange={(e) => setAddDishForm({ ...addDishForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-teal-50/30 border-2 border-teal-50 rounded-xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium"
                >
                  <option value="">Select Category</option>
                  <option value="Starters">Starters / Appetizers</option>
                  <option value="Mains">Main Course</option>
                  <option value="Live Counter">Live Counter / Station</option>
                  <option value="Sides">Sides / Accompaniments</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              {/* Dietary Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Dietary Tags</label>
                <div className="flex flex-wrap gap-2">
                  {['veg', 'non-veg', 'jain', 'vegan', 'gluten-free'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietaryTag(tag, true)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${addDishForm.dietaryTags.includes(tag)
                        ? 'bg-gradient-to-br from-teal-600 to-violet-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingDish(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDish}
                disabled={isSaving}
                className="px-6 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-200 transition-all flex items-center space-x-2"
              >
                {isSaving ? <span>Adding...</span> : <span>Add Dish</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
