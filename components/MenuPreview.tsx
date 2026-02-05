
import React, { useState } from 'react';
import { GeneratedMenu, MenuItem, SubMenuItem } from '../types';
import { addDishToLibrary, fetchDishesByCuisine, addSubMenuItem, updateSubMenuItem, fetchSubMenuItemsByDishId } from '../services/supabaseService';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

interface MenuPreviewProps {
  menu: GeneratedMenu;
  onUpdate: (menu: GeneratedMenu) => void;
  imageUrl: string | null;
  userRole: 'admin' | 'staff';
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ menu, onUpdate, imageUrl, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [exchangeTarget, setExchangeTarget] = useState<{ sIdx: number, iIdx: number } | null>(null);
  const [alternatives, setAlternatives] = useState<MenuItem[]>([]);
  const [isSearchingAlts, setIsSearchingAlts] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [subItemDrafts, setSubItemDrafts] = useState<Record<string, { name: string; description: string }>>({});
  const [newSubItemDrafts, setNewSubItemDrafts] = useState<Record<string, { name: string; description: string }>>({});
  const [subItemSaving, setSubItemSaving] = useState<Record<string, boolean>>({});
  const [subItemAdding, setSubItemAdding] = useState<Record<string, boolean>>({});
  const [allSubItemsByDishId, setAllSubItemsByDishId] = useState<Record<string, SubMenuItem[]>>({});
  const [subItemsLoading, setSubItemsLoading] = useState<Record<string, boolean>>({});
  const [categorySuggestions, setCategorySuggestions] = useState<Record<string, MenuItem[]>>({});

  const updateItem = (sectionIdx: number, itemIdx: number, updates: Partial<MenuItem>) => {
    const newSections = [...menu.sections];
    newSections[sectionIdx].items[itemIdx] = { ...newSections[sectionIdx].items[itemIdx], ...updates };
    onUpdate({ ...menu, sections: newSections });
  };

  const addItem = async (sectionIdx: number) => {
    const newDish: MenuItem = {
      name: "Chef's Signature Selection",
      description: "A freshly curated seasonal creation based on your event theme.",
      dietaryTags: ["Veg"]
    };

    const newSections = [...menu.sections];
    const newItemIdx = newSections[sectionIdx].items.length;
    newSections[sectionIdx].items.push(newDish);
    onUpdate({ ...menu, sections: newSections });

    const cuisine = menu.cuisineRegion || 'Indian';
    const category = menu.sections[sectionIdx].category;
    try {
      const created = await addDishToLibrary(cuisine, category, newDish);
      const updatedSections = [...newSections];
      updatedSections[sectionIdx].items[newItemIdx] = {
        ...updatedSections[sectionIdx].items[newItemIdx],
        id: created.id
      };
      onUpdate({ ...menu, sections: updatedSections });
    } catch (err) {
      console.error("Failed to persist to Supabase:", err);
    }
  };

  const removeItem = (sectionIdx: number, itemIdx: number) => {
    const newSections = [...menu.sections];
    newSections[sectionIdx].items.splice(itemIdx, 1);
    onUpdate({ ...menu, sections: newSections });
  };

  const updateHeader = (field: keyof GeneratedMenu, value: string) => {
    onUpdate({ ...menu, [field]: value });
  };

  const getSubItemDraft = (key: string, sub: { name: string; description?: string }) => {
    return subItemDrafts[key] ?? { name: sub.name ?? '', description: sub.description ?? '' };
  };

  const updateSubItemDraft = (key: string, updates: Partial<{ name: string; description: string }>) => {
    setSubItemDrafts(prev => ({
      ...prev,
      [key]: { ...(prev[key] ?? { name: '', description: '' }), ...updates }
    }));
  };

  const getNewSubItemDraft = (dishKey: string) => {
    return newSubItemDrafts[dishKey] ?? { name: '', description: '' };
  };

  const updateNewSubItemDraft = (dishKey: string, updates: Partial<{ name: string; description: string }>) => {
    setNewSubItemDrafts(prev => ({
      ...prev,
      [dishKey]: { ...(prev[dishKey] ?? { name: '', description: '' }), ...updates }
    }));
  };

  const applySubItemUpdateToMenu = (dishId: string, subId: string, updates: Partial<{ name: string; description: string }>) => {
    const newSections = menu.sections.map(section => ({
      ...section,
      items: section.items.map(item => {
        if (item.id !== dishId) return item;
        const updatedSubs = (item.subMenuItems ?? []).map(sub =>
          sub.id === subId ? { ...sub, ...updates } : sub
        );
        return { ...item, subMenuItems: updatedSubs };
      })
    }));
    onUpdate({ ...menu, sections: newSections });
  };

  const applySubItemAddToMenu = (dishId: string, newSub: { id?: string; name: string; description: string; dietaryTags: string[] }) => {
    const newSections = menu.sections.map(section => ({
      ...section,
      items: section.items.map(item => {
        if (item.id !== dishId) return item;
        const updatedSubs = [...(item.subMenuItems ?? []), newSub];
        return { ...item, subMenuItems: updatedSubs };
      })
    }));
    onUpdate({ ...menu, sections: newSections });
  };

  const ensureSubItemsLoaded = async (dishId: string) => {
    if (!dishId || allSubItemsByDishId[dishId]) return;
    setSubItemsLoading(prev => ({ ...prev, [dishId]: true }));
    try {
      const items = await fetchSubMenuItemsByDishId(dishId);
      setAllSubItemsByDishId(prev => ({ ...prev, [dishId]: items }));
    } catch (e) {
      console.error("Failed to load sub menu items", e);
    } finally {
      setSubItemsLoading(prev => ({ ...prev, [dishId]: false }));
    }
  };

  const isSubItemInMenu = (item: MenuItem, subId?: string) => {
    if (!subId) return false;
    return (item.subMenuItems ?? []).some(sub => sub.id === subId);
  };

  const addExistingSubItemToMenu = (dishId: string, sub: SubMenuItem) => {
    applySubItemAddToMenu(dishId, {
      id: sub.id,
      name: sub.name,
      description: sub.description ?? '',
      dietaryTags: sub.dietaryTags ?? []
    });
  };

  const removeSubItemFromMenu = (dishId: string, subId: string) => {
    applySubItemDeleteToMenu(dishId, subId);
  };

  React.useEffect(() => {
    if (!isEditing) return;
    const dishIds = new Set<string>();
    menu.sections.forEach(section => {
      section.items.forEach(item => {
        if (item.id) dishIds.add(item.id);
      });
    });
    dishIds.forEach((id) => {
      if (!allSubItemsByDishId[id]) {
        void ensureSubItemsLoaded(id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, menu.sections]);

  const applySubItemDeleteToMenu = (dishId: string, subId: string) => {
    const newSections = menu.sections.map(section => ({
      ...section,
      items: section.items.map(item => {
        if (item.id !== dishId) return item;
        const updatedSubs = (item.subMenuItems ?? []).filter(sub => sub.id !== subId);
        return { ...item, subMenuItems: updatedSubs };
      })
    }));
    onUpdate({ ...menu, sections: newSections });
  };

  const CATEGORY_TITLES: Array<{ key: string; title: string }> = [
    { key: 'appetizers', title: 'Appetizers & Starters' },
    { key: 'mains', title: 'Main Course Selection' },
    { key: 'liveStations', title: 'Live Stations' },
    { key: 'sides', title: 'Accompaniments' },
    { key: 'desserts', title: 'The Grand Finale (Desserts)' },
    { key: 'beverages', title: 'Beverage Craft' }
  ];

  const addCategorySection = (title: string) => {
    const newSections = [...menu.sections, { category: title, items: [] }];
    onUpdate({ ...menu, sections: newSections });
  };

  const pickRandomItems = (list: MenuItem[], count: number, excludeNames: Set<string> = new Set()) => {
    const filtered = list.filter(item => !excludeNames.has(item.name));
    if (filtered.length <= count) return filtered;
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const sectionTitleToBucketKey = (title: string) => {
    const t = (title || '').toLowerCase();
    if (t.includes('appet') || t.includes('starter')) return 'appetizers';
    if (t.includes('main')) return 'mains';
    if (t.includes('live') || t.includes('station') || t.includes('counter')) return 'liveStations';
    if (t.includes('side') || t.includes('accomp')) return 'sides';
    if (t.includes('dessert') || t.includes('finale')) return 'desserts';
    if (t.includes('beverage') || t.includes('drink')) return 'beverages';
    return 'mains';
  };

  const addCategoryWithAutoFill = async (title: string) => {
    const cuisine = menu.cuisineRegion || 'Indian';
    try {
      const library = await fetchDishesByCuisine(cuisine);
      const bucketKey = sectionTitleToBucketKey(title);
      const bucketList = library[bucketKey] ?? [];
      const initialItems = pickRandomItems(bucketList, 2);
      const initialNames = new Set(initialItems.map(i => i.name));
      const suggestions = pickRandomItems(bucketList, 2, initialNames);

      const newSections = [...menu.sections, { category: title, items: initialItems }];
      onUpdate({ ...menu, sections: newSections });
      setCategorySuggestions(prev => ({ ...prev, [title]: suggestions }));
    } catch (e) {
      console.error('Failed to auto-populate category', e);
      const newSections = [...menu.sections, { category: title, items: [] }];
      onUpdate({ ...menu, sections: newSections });
    }
  };

  const addSuggestedItemToSection = (title: string, item: MenuItem) => {
    const newSections = menu.sections.map(section => {
      if (section.category !== title) return section;
      if (section.items.some(i => i.name === item.name)) return section;
      return { ...section, items: [...section.items, item] };
    });
    onUpdate({ ...menu, sections: newSections });
    setCategorySuggestions(prev => {
      const remaining = (prev[title] ?? []).filter(s => s.name !== item.name);
      return { ...prev, [title]: remaining };
    });
  };

  const handleExchangeClick = async (sIdx: number, iIdx: number) => {
    setExchangeTarget({ sIdx, iIdx });
    setIsSearchingAlts(true);
    const category = menu.sections[sIdx].category;
    const cuisine = menu.cuisineRegion || 'Indian';

    try {
      const library = await fetchDishesByCuisine(cuisine);
      const catKey = category.toLowerCase().includes('starter') ? 'appetizers' :
        category.toLowerCase().includes('main') ? 'mains' :
          category.toLowerCase().includes('station') ? 'liveStations' :
            category.toLowerCase().includes('side') || category.toLowerCase().includes('accomp') ? 'sides' :
              category.toLowerCase().includes('dessert') ? 'desserts' : 'beverages';

      const alts = (library[catKey] || []).filter(item => item.name !== menu.sections[sIdx].items[iIdx].name);
      setAlternatives(alts);
    } catch (e) {
      console.error("Exchange fetch failed", e);
    } finally {
      setIsSearchingAlts(false);
    }
  };

  const performExchange = (newItem: MenuItem) => {
    if (!exchangeTarget) return;
    const { sIdx, iIdx } = exchangeTarget;
    updateItem(sIdx, iIdx, newItem);
    setExchangeTarget(null);
    setAlternatives([]);
  };

  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setIsEditing(false);

    // Wait for state updates
    setTimeout(async () => {
      // 1. Setup Simulator
      const simulator = document.createElement('div');
      simulator.id = 'pdf-export-simulator';
      document.body.appendChild(simulator);

      try {
        const segments: HTMLElement[] = [];

        // Find Header
        const header = document.getElementById('pdf-header-segment');
        if (header) segments.push(header);

        // Find Categories
        const categories = document.querySelectorAll('.pdf-category-segment');
        categories.forEach(cat => segments.push(cat as HTMLElement));

        // Find Footer
        const footer = document.getElementById('pdf-footer-segment');
        if (footer) segments.push(footer);

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i];

          // Clone segment into simulator for capture
          simulator.innerHTML = '';
          const clone = segment.cloneNode(true) as HTMLElement;
          // Apply 'exporting' class to handle CSS visibility overrides (like showing header)
          clone.classList.add('exporting');
          simulator.appendChild(clone);

          // Capture Segment
          const dataUrl = await toJpeg(clone, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            width: 1024
          });

          // Add Page (after the first one)
          if (i > 0) pdf.addPage();

          // Calculate dimensions to fit width with padding
          const imgProps = pdf.getImageProperties(dataUrl);
          const margin = 10; // 10mm horizontal margin
          const finalImgWidth = pdfWidth - (margin * 2);
          const finalImgHeight = (imgProps.height * finalImgWidth) / imgProps.width;

          // If segment is longer than page, scale it down to fit height too
          let drawWidth = finalImgWidth;
          let drawHeight = finalImgHeight;
          if (drawHeight > pdfHeight - 20) {
            const scale = (pdfHeight - 20) / drawHeight;
            drawHeight *= scale;
            drawWidth *= scale;
          }

          // Center on page
          const xOffset = (pdfWidth - drawWidth) / 2;
          const yOffset = (pdfHeight - drawHeight) / 2;

          pdf.addImage(dataUrl, 'JPEG', xOffset, yOffset, drawWidth, drawHeight);
        }

        pdf.save(`${menu.title.replace(/\s+/g, '_')}_Menu.pdf`);

      } catch (err) {
        console.error("PDF Export failed:", err);
        window.print();
      } finally {
        document.body.removeChild(simulator);
        setIsExporting(false);
      }
    }, 800);
  };

  return (
    <div className="relative">
      {/* RESPONSIVE ACTION BAR */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[250] no-print">
        <div className="flex items-center bg-white/90 backdrop-blur-xl p-1.5 sm:p-2 rounded-full shadow-2xl border-2 border-teal-100">

          {userRole === 'admin' && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isExporting}
                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all btn-bounce ${isEditing ? 'bg-amber-400 text-white shadow-lg' : 'bg-gradient-to-r from-teal-600 to-violet-600 text-white shadow-lg'
                  } disabled:opacity-50`}
              >
                {isExporting ? 'Get Set Cook...' : (isEditing ? '💾 Save' : '👨‍🍳 Edit')}
              </button>
              <div className="w-px h-6 sm:h-8 bg-stone-200 mx-1.5 sm:mx-3"></div>
            </>
          )}

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-lg sm:text-xl transition-all ${isExporting ? 'animate-spin opacity-50' : ''}`}
            title="Export PDF"
          >
            {isExporting ? '🌀' : '📄'}
          </button>
        </div>
      </div>

      {/* Exchange Shop Modal */}
      {exchangeTarget && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl no-print animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-violet-600 p-6 sm:p-8 text-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl sm:text-3xl font-black italic">Dish Swap Shop 🔄</h3>
                <button onClick={() => setExchangeTarget(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-lg">✕</button>
              </div>
              <p className="text-white/80 font-medium italic text-sm">Replace "{menu.sections[exchangeTarget.sIdx].items[exchangeTarget.iIdx].name}"</p>
            </div>
            <div className="p-4 sm:p-8 max-h-[60vh] overflow-y-auto space-y-3 bg-slate-50">
              {isSearchingAlts ? (
                <div className="flex flex-col items-center py-10 text-violet-400">
                  <div className="text-5xl animate-spin mb-4">🥣</div>
                  <p className="font-black italic animate-pulse">Searching...</p>
                </div>
              ) : alternatives.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {alternatives.map((alt, idx) => (
                    <button key={idx} onClick={() => performExchange(alt)} className="text-left bg-white hover:bg-violet-600 p-4 sm:p-6 rounded-3xl border-2 border-slate-100 transition-all flex justify-between items-center group shadow-sm">
                      <div className="flex-1 pr-4">
                        <h4 className="font-black text-slate-800 group-hover:text-white text-base sm:text-lg">{alt.name}</h4>
                        <p className="text-slate-500 group-hover:text-white/70 text-xs mt-1 line-clamp-2">{alt.description}</p>
                      </div>
                      <span className="text-2xl opacity-0 group-hover:opacity-100 transition-all">👉</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-lg font-black">No alternatives found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT WRAPPER */}
      <div id="menu-document" className="bg-white rounded-[2rem] sm:rounded-[4rem] shadow-2xl overflow-hidden border-4 sm:border-8 border-white animate-fade-in print-full-width">
        <div id="pdf-header-segment">
          {/* PDF LOGO HEADER (Visible on Print/Export) */}
          <div className="hidden exporting-flex print:flex items-center justify-between p-8 sm:p-12 border-b-2 border-slate-50 bg-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-violet-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg text-white">🥗</div>
              <span className="text-3xl font-black text-stone-800 tracking-tighter">Wedding Kitchen</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-600">Premium Catering Service</p>
              <p className="text-stone-400 text-[8px] font-bold">Generated by WeddingKitchen AI</p>
            </div>
          </div>
          {/* Banner */}
          <div className="relative h-[250px] sm:h-[450px] w-full overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Food"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-600 to-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-4xl sm:text-8xl opacity-10">YUMMY!</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12">
              <div className="bg-amber-400 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] px-3 sm:px-4 py-1 sm:py-2 rounded-full w-fit mb-2 sm:mb-4">Masterpiece Presentation</div>
              {isEditing ? (
                <input
                  value={menu.title}
                  onChange={(e) => updateHeader('title', e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-xl border-2 sm:border-4 border-white/40 rounded-xl sm:rounded-[2rem] px-4 sm:px-8 py-3 sm:py-5 text-2xl sm:text-5xl font-black text-white italic outline-none shadow-inner"
                />
              ) : (
                <h1 className="text-3xl sm:text-6xl md:text-7xl font-black text-white italic drop-shadow-2xl leading-tight">{menu.title}</h1>
              )}
            </div>
          </div>

          <div className="px-6 sm:px-12 md:px-24 pt-16 sm:pt-24">
            {/* Description */}
            <section className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-10 pdf-card">
              <div className="text-4xl sm:text-7xl no-print">🥕</div>
              {isEditing ? (
                <textarea
                  value={menu.eventDescription}
                  onChange={(e) => updateHeader('eventDescription', e.target.value)}
                  className="w-full bg-teal-50 border-4 border-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-slate-600 text-base sm:text-lg font-light leading-loose italic text-center outline-none shadow-inner"
                />
              ) : (
                <p
                  className="text-slate-600 text-base sm:text-lg font-light leading-loose italic"
                  dangerouslySetInnerHTML={{ __html: menu.eventDescription }}
                />
              )}
            </section>
          </div>
        </div>

        <div className="p-6 sm:p-12 md:p-24 space-y-16 sm:space-y-24 relative">
          {/* Background Icons */}
          <div className="absolute top-40 right-10 text-6xl sm:text-9xl opacity-[0.03] select-none pointer-events-none no-print">🥗</div>
          <div className="absolute bottom-40 left-10 text-6xl sm:text-9xl opacity-[0.03] select-none pointer-events-none no-print">🍤</div>

          {/* Menu Sections */}
          <div className="space-y-24 sm:space-y-32">
            {(() => {
              const sectionByTitle = new Map(menu.sections.map(s => [s.category, s]));
              const orderedSections = CATEGORY_TITLES.map(cat => {
                const section = sectionByTitle.get(cat.title);
                return section ?? { category: cat.title, items: [], __placeholder: true };
              });
              const extras = menu.sections.filter(s => !CATEGORY_TITLES.some(cat => cat.title === s.category));
              return [...orderedSections, ...extras];
            })().map((section: any, sIdx: number) => (
              <div
                key={`${section.category}-${sIdx}`}
                className={`space-y-10 sm:space-y-16 ${section.__placeholder ? '' : 'pdf-section pdf-category-segment'}`}
              >
                {!section.__placeholder && (
                  <div className="flex flex-col items-center">
                    <div className="text-[8px] sm:text-[10px] md:text-xs font-black text-teal-400 uppercase tracking-[0.4em] sm:tracking-[0.6em] mb-2 sm:mb-4 text-center">Selection {sIdx + 1}</div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-violet-600 italic pb-2 text-center">
                      {section.category}
                    </h3>
                    <div className="w-16 sm:w-24 md:w-32 lg:w-40 h-1 sm:h-1.5 md:h-2 lg:h-2.5 bg-teal-500 rounded-full shadow-sm"></div>
                  </div>
                )}

                {section.__placeholder && !isExporting ? (
                  <div className="no-print no-export">
                    <button
                      onClick={() => addCategoryWithAutoFill(section.category)}
                      className={`group w-full border-2 border-dashed border-teal-100 rounded-[2rem] p-8 text-left bg-white/50 hover:bg-white transition-all shadow-sm hover:shadow-[0_0_30px_rgba(13,148,136,0.25)] ${userRole === 'admin' ? '' : 'opacity-50 cursor-not-allowed'}`}
                      disabled={userRole !== 'admin'}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-teal-400/70 group-hover:text-teal-600 transition-colors">{section.category}</span>
                        <span className="text-3xl text-teal-300/70 group-hover:text-teal-600 transition-colors">＋</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Category is missing from this menu. Click to add.</p>
                    </button>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
                  {section.items.map((item, iIdx) => (
                    <div key={iIdx} className={`group p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] relative pdf-card flex flex-col ${isEditing ? 'bg-teal-50 border-2 sm:border-4 border-white shadow-md' : 'bg-teal-50/50'}`}>
                      {/* Item Controls */}
                      <div className={`absolute -top-4 -right-4 flex space-x-2 z-[50] no-print ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                        <button onClick={() => handleExchangeClick(sIdx, iIdx)} className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl hover:rotate-180 transition-all text-xl sm:text-2xl">🔄</button>
                        {isEditing && (
                          <button onClick={() => removeItem(sIdx, iIdx)} className="w-10 h-10 sm:w-14 sm:h-14 bg-pink-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl text-xl sm:text-2xl">🗑️</button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4">
                        {/* Dish Image */}
                        <div className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md self-center sm:self-start">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-xl sm:text-2xl opacity-20">🍽️</div>
                          )}
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex justify-between items-start gap-2">
                            {isEditing ? (
                              <input value={item.name} onChange={(e) => updateItem(sIdx, iIdx, { name: e.target.value })} className="w-full bg-white border-2 border-amber-100 font-black text-slate-800 text-lg px-3 py-1 rounded-lg" />
                            ) : (
                              <h4 className="w-full font-black text-slate-800 text-lg sm:text-xl md:text-2xl tracking-tight leading-none text-center sm:text-left">{item.name}</h4>
                            )}
                          </div>
                          {!isEditing && (
                            <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                              {item.dietaryTags.map(tag => (
                                <span key={tag} className="text-[7px] sm:text-[8px] md:text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-100 font-black text-slate-400 uppercase">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <textarea value={item.description} onChange={(e) => updateItem(sIdx, iIdx, { description: e.target.value })} className="w-full bg-white border border-amber-50 rounded-xl p-4 text-slate-600 text-xs min-h-[100px]" />
                      ) : (
                        <>
                          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium text-center sm:text-left">{item.description}</p>

                          {/* Sub-menu display */}
                          {item.subMenuItems && item.subMenuItems.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-teal-100/50">
                              <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-2 text-center sm:text-left">Options Include</p>
                              <div className="grid grid-cols-1 gap-2">
                                {item.subMenuItems.map((sub, idx) => (
                                  <div key={idx} className="flex items-start space-x-2">
                                    <span className="text-teal-500 mt-0.5">•</span>
                                    <div>
                                      <span className="text-xs font-bold text-slate-700">{sub.name}</span>
                                      {sub.description && <span className="text-[10px] text-slate-400 ml-2 italic">— {sub.description}</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {isEditing && (
                        <div className="mt-5 pt-4 border-t border-teal-100/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">Options</p>
                            {!item.id && (
                              <span className="text-[9px] text-slate-400 italic">Save dish to library to edit options</span>
                            )}
                          </div>

                          {item.id && (
                            <div className="bg-white rounded-xl p-3 border border-teal-50 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Options</span>
                                <button
                                  onClick={() => ensureSubItemsLoaded(item.id as string)}
                                  className="text-[10px] font-black uppercase tracking-widest text-teal-600 hover:text-teal-700"
                                >
                                  {subItemsLoading[item.id as string] ? 'Loading...' : 'Load Options'}
                                </button>
                              </div>
                              {(allSubItemsByDishId[item.id as string] ?? []).length > 0 ? (
                                <div className="space-y-2">
                                  {(allSubItemsByDishId[item.id as string] ?? []).map((sub) => {
                                    const inMenu = isSubItemInMenu(item, sub.id);
                                    return (
                                      <div key={sub.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                                        <div className="flex-1 pr-2">
                                          <div className="text-xs font-bold text-slate-800">{sub.name}</div>
                                          {sub.description && <div className="text-[10px] text-slate-400 line-clamp-1">{sub.description}</div>}
                                        </div>
                                        {inMenu ? (
                                          <button
                                            onClick={() => removeSubItemFromMenu(item.id as string, sub.id as string)}
                                            className="text-[9px] font-black uppercase tracking-widest bg-slate-200 text-slate-600 px-2 py-1 rounded-full"
                                          >
                                            Remove
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => addExistingSubItemToMenu(item.id as string, sub)}
                                            className="text-[9px] font-black uppercase tracking-widest bg-teal-600 text-white px-2 py-1 rounded-full"
                                          >
                                            Add
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-400 italic">No saved options yet.</div>
                              )}
                            </div>
                          )}

                          {(item.subMenuItems ?? []).length > 0 ? (
                            <div className="space-y-2">
                              {(item.subMenuItems ?? []).map((sub, subIdx) => {
                                const key = sub.id ?? `local-${sIdx}-${iIdx}-${subIdx}`;
                                const draft = getSubItemDraft(key, sub);
                                const saving = !!sub.id && subItemSaving[sub.id];
                                return (
                                  <div key={key} className="bg-white rounded-xl p-3 border border-teal-50 space-y-2">
                                    <input
                                      value={draft.name}
                                      onChange={(e) => updateSubItemDraft(key, { name: e.target.value })}
                                      className="w-full bg-teal-50/30 border border-teal-100 rounded-lg px-3 py-2 text-xs font-semibold outline-none"
                                      disabled={!sub.id || !item.id || saving}
                                      placeholder="Option name"
                                    />
                                    <input
                                      value={draft.description}
                                      onChange={(e) => updateSubItemDraft(key, { description: e.target.value })}
                                      className="w-full bg-teal-50/30 border border-teal-100 rounded-lg px-3 py-2 text-xs outline-none"
                                      disabled={!sub.id || !item.id || saving}
                                      placeholder="Short description"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={async () => {
                                          if (!item.id || !sub.id) return;
                                          setSubItemSaving(prev => ({ ...prev, [sub.id as string]: true }));
                                          try {
                                            await updateSubMenuItem(sub.id, {
                                              name: draft.name.trim(),
                                              description: draft.description.trim()
                                            });
                                            applySubItemUpdateToMenu(item.id, sub.id, {
                                              name: draft.name.trim(),
                                              description: draft.description.trim()
                                            });
                                          } catch (e) {
                                            console.error("Failed to update sub menu item", e);
                                          } finally {
                                            setSubItemSaving(prev => ({ ...prev, [sub.id as string]: false }));
                                          }
                                        }}
                                        className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-teal-600 text-white rounded-full disabled:opacity-50"
                                        disabled={!item.id || !sub.id || saving || !draft.name.trim()}
                                      >
                                        {saving ? 'Saving...' : 'Save'}
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (!item.id || !sub.id) return;
                                          removeSubItemFromMenu(item.id, sub.id);
                                        }}
                                        className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-200 text-slate-600 rounded-full"
                                        disabled={!item.id || !sub.id}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic">No options yet.</div>
                          )}

                          <div className="bg-teal-50/40 border-2 border-dashed border-teal-100 rounded-xl p-3 space-y-2">
                            <input
                              value={getNewSubItemDraft(item.id || `tmp-${sIdx}-${iIdx}`).name}
                              onChange={(e) => updateNewSubItemDraft(item.id || `tmp-${sIdx}-${iIdx}`, { name: e.target.value })}
                              className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-xs font-semibold outline-none"
                              placeholder="New option name"
                              disabled={!item.id}
                            />
                            <input
                              value={getNewSubItemDraft(item.id || `tmp-${sIdx}-${iIdx}`).description}
                              onChange={(e) => updateNewSubItemDraft(item.id || `tmp-${sIdx}-${iIdx}`, { description: e.target.value })}
                              className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-xs outline-none"
                              placeholder="New option description"
                              disabled={!item.id}
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={async () => {
                                  if (!item.id) return;
                                  const draft = getNewSubItemDraft(item.id);
                                  if (!draft.name.trim()) return;
                                  setSubItemAdding(prev => ({ ...prev, [item.id as string]: true }));
                                  try {
                                    const created = await addSubMenuItem(item.id, {
                                      name: draft.name.trim(),
                                      description: draft.description.trim(),
                                      dietaryTags: []
                                    });
                                    applySubItemAddToMenu(item.id, created);
                                    setAllSubItemsByDishId(prev => ({
                                      ...prev,
                                      [item.id as string]: [...(prev[item.id as string] ?? []), created]
                                    }));
                                    updateNewSubItemDraft(item.id, { name: '', description: '' });
                                  } catch (e) {
                                    console.error("Failed to add sub menu item", e);
                                  } finally {
                                    setSubItemAdding(prev => ({ ...prev, [item.id as string]: false }));
                                  }
                                }}
                                className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-violet-600 text-white rounded-full disabled:opacity-50"
                                disabled={!item.id || subItemAdding[item.id as string] || !getNewSubItemDraft(item.id || '').name.trim()}
                              >
                                {subItemAdding[item.id as string] ? 'Adding...' : 'Add Option'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button onClick={() => addItem(sIdx)} className="h-full min-h-[150px] sm:min-h-[200px] border-4 sm:border-8 border-dashed border-teal-100 rounded-[2rem] sm:rounded-[3rem] flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-teal-200 hover:text-teal-600 no-print transition-colors">
                      <div className="text-4xl sm:text-5xl md:text-6xl">🧑‍🍳</div>
                      <span className="font-black text-sm sm:text-base md:text-xl uppercase tracking-tighter">Invent a Dish</span>
                    </button>
                  )}
                </div>
                )}

                {!section.__placeholder && !isExporting && (categorySuggestions[section.category] ?? []).length > 0 && (
                  <div className="no-print no-export mt-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-3 text-center">Suggested Dishes</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(categorySuggestions[section.category] ?? []).map((sug, idx) => (
                        <button
                          key={`${sug.name}-${idx}`}
                          onClick={() => addSuggestedItemToSection(section.category, sug)}
                          className="group bg-white border border-teal-100 rounded-2xl p-4 text-left hover:shadow-[0_0_20px_rgba(13,148,136,0.2)] transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 pr-3">
                              <div className="text-sm font-bold text-slate-800">{sug.name}</div>
                              <div className="text-[10px] text-slate-400 line-clamp-2">{sug.description || '—'}</div>
                            </div>
                            <span className="text-xl text-teal-400 group-hover:text-teal-600 transition-colors">＋</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Grid */}
          <div id="pdf-footer-segment" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 pt-16 sm:pt-24 border-t-4 sm:border-t-8 border-dashed border-slate-50">
            <div className="bg-yellow-50 p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border-2 sm:border-4 border-white shadow-xl pdf-card">
              <h4 className="font-black text-yellow-700 text-[10px] sm:text-sm uppercase tracking-[0.3em] mb-6 sm:mb-8 text-center">Architect's Notes</h4>
              {isEditing ? (
                <textarea value={menu.chefsNotes} onChange={(e) => updateHeader('chefsNotes', e.target.value)} className="w-full bg-white rounded-2xl p-6 font-handwritten text-xl sm:text-3xl min-h-[140px]" />
              ) : (
                <p className="text-slate-600 font-handwritten text-xl sm:text-3xl leading-relaxed text-center">{menu.chefsNotes}</p>
              )}
            </div>
            <div className="bg-pink-50 p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border-2 sm:border-4 border-white shadow-xl pdf-card">
              <h4 className="font-black text-pink-700 text-[10px] sm:text-sm uppercase tracking-[0.3em] mb-6 sm:mb-8 text-center">The Perfect Pour</h4>
              {isEditing ? (
                <textarea value={menu.winePairing} onChange={(e) => updateHeader('winePairing', e.target.value)} className="w-full bg-white rounded-2xl p-6 font-handwritten text-xl sm:text-3xl min-h-[140px]" />
              ) : (
                <p className="text-slate-600 font-handwritten text-xl sm:text-3xl leading-relaxed text-center">{menu.winePairing}</p>
              )}
            </div>
          </div>

          <div className="text-center pt-8 sm:pt-16 no-print space-y-4">
            <div className="text-slate-300 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.6em]">Designed for Modern Palates</div>
            <button
              onClick={() => isEditing ? setIsEditing(false) : handleExportPDF()}
              className={`text-white px-10 sm:px-20 py-4 sm:py-6 rounded-full font-black text-lg sm:text-xl uppercase tracking-[0.3em] shadow-xl ${isEditing ? 'bg-amber-400' : 'bg-gradient-to-r from-teal-600 to-violet-600'
                }`}
            >
              {isExporting ? 'Get Set Cook...' : (isEditing ? 'Save Concept ✨' : 'Let`s Cook 📄')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
