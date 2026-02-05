
import React from 'react';
import { MenuPreferences, CategoryCounts } from '../types';

interface MenuFormProps {
  onSubmit: (prefs: MenuPreferences) => void;
  isLoading: boolean;
}

export const MenuForm: React.FC<MenuFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<MenuPreferences>({
    eventName: '',
    clientName: '',
    eventType: 'Wedding',
    date: new Date().toISOString().split('T')[0],
    guestCount: '50',
    cuisines: ['Any / Mix'],
    composition: {
      appetizers: 3,
      mains: 2,
      liveStations: 0,
      sides: 2,
      desserts: 1,
      beverages: 0
    },
    internalNotes: '',
    budgetLevel: 'standard'
  });

  const cuisineOptions = ['Any / Mix', 'Indian', 'Italian', 'Asian', 'French', 'Mediterranean', 'Mexican', 'American'];

  const toggleCuisine = (cuisine: string) => {
    setFormData(prev => {
      let newCuisines = [...prev.cuisines];
      if (cuisine === 'Any / Mix') return { ...prev, cuisines: ['Any / Mix'] };
      newCuisines = newCuisines.filter(c => c !== 'Any / Mix');
      if (newCuisines.includes(cuisine)) {
        newCuisines = newCuisines.filter(c => c !== cuisine);
      } else {
        newCuisines.push(cuisine);
      }
      if (newCuisines.length === 0) newCuisines = ['Any / Mix'];
      return { ...prev, cuisines: newCuisines };
    });
  };

  const updateCount = (key: keyof CategoryCounts, delta: number) => {
    setFormData(prev => ({
      ...prev,
      composition: { ...prev.composition, [key]: Math.max(0, prev.composition[key] + delta) }
    }));
  };

  const Counter = ({ label, value, onUpdate }: { label: string, value: number, onUpdate: (d: number) => void }) => (
    <div className="flex flex-col items-center p-3 rounded-2xl bg-teal-50/50 border-2 border-transparent hover:border-teal-200 transition-all">
      <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest mb-2">{label}</span>
      <div className="flex items-center space-x-3">
        <button
          type="button" onClick={() => onUpdate(-1)}
          className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-teal-600 hover:bg-teal-600 hover:text-white transition-all font-black text-xl"
        >-</button>
        <span className="text-xl font-black text-teal-800">{value}</span>
        <button
          type="button" onClick={() => onUpdate(1)}
          className="w-8 h-8 rounded-full bg-teal-600 shadow-md flex items-center justify-center text-white hover:bg-teal-700 transition-all font-black text-xl"
        >+</button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(13,148,136,0.15)] overflow-hidden border-4 border-white">
      {/* Playful Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-violet-600 p-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl">
            ✨
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">Create Menu Magic!</h2>
            <p className="text-white/80 text-sm font-medium">Let's build something delicious together.</p>
          </div>
        </div>
        <div className="hidden sm:block text-5xl opacity-30">🍕</div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-10 space-y-10">
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📝</span>
            <h3 className="text-lg font-extrabold text-slate-800 uppercase tracking-tight">The Basics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Event Type</label>
              <input
                placeholder="Wedding, Birthday, Gala..."
                className="w-full px-5 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium"
                value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Event Vibe</label>
              <input
                placeholder="A magical night..."
                className="w-full px-5 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium"
                value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Client Name</label>
              <input
                placeholder="John & Jane Doe"
                className="w-full px-5 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium"
                value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Party Date</label>
              <input
                type="date"
                className="w-full px-5 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium"
                value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Estimated Guests</label>
              <input
                type="text"
                placeholder="50 (or 50-60)"
                className="w-full px-5 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-500 focus:bg-white transition-all text-sm font-medium"
                value={formData.guestCount} onChange={e => setFormData({ ...formData, guestCount: e.target.value })}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌍</span>
            <h3 className="text-lg font-extrabold text-slate-800 uppercase tracking-tight">Pick Your Flavors</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {cuisineOptions.map(opt => (
              <button
                key={opt} type="button" onClick={() => toggleCuisine(opt)}
                className={`px-6 py-3 rounded-full text-sm font-extrabold transition-all btn-bounce ${formData.cuisines.includes(opt)
                  ? 'bg-gradient-to-br from-teal-600 to-violet-600 text-white shadow-lg shadow-teal-200'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🥘</span>
              <h3 className="text-lg font-extrabold text-slate-800 uppercase tracking-tight">Menu Mix</h3>
            </div>
            <span className="text-xs font-bold text-teal-600">More is more!</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Counter label="Starters" value={formData.composition.appetizers} onUpdate={(d) => updateCount('appetizers', d)} />
            <Counter label="Main Deals" value={formData.composition.mains} onUpdate={(d) => updateCount('mains', d)} />
            <Counter label="Live Stations" value={formData.composition.liveStations} onUpdate={(d) => updateCount('liveStations', d)} />
            <Counter label="Sides" value={formData.composition.sides} onUpdate={(d) => updateCount('sides', d)} />
            <Counter label="Sweet Stuff" value={formData.composition.desserts} onUpdate={(d) => updateCount('desserts', d)} />
            <Counter label="Beverages" value={formData.composition.beverages} onUpdate={(d) => updateCount('beverages', d)} />
          </div>
        </section>

        <button
          type="submit" disabled={isLoading}
          className="w-full bg-gradient-to-r from-teal-600 to-violet-600 hover:from-teal-700 hover:to-violet-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-teal-200 btn-bounce text-xl flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          {isLoading ? <span className="animate-pulse">Chef is Thinking...</span> : (
            <>
              {/* <span>🚀</span> */}
              <span>Let's Feast!</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
