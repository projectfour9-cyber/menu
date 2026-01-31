import React, { useEffect, useState } from 'react';
import { fetchMenuHistory, deleteMenuFromHistory } from '../services/supabaseService';
import { GeneratedMenu } from '../types';

interface MenuHistoryProps {
    onViewMenu: (menu: GeneratedMenu) => void;
}

export const MenuHistory: React.FC<MenuHistoryProps> = ({ onViewMenu }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await fetchMenuHistory();
            setHistory(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this menu?')) return;
        try {
            await deleteMenuFromHistory(id);
            setHistory(history.filter(m => m.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="text-6xl animate-bounce">📖</div>
            <div className="text-teal-600 font-black tracking-widest uppercase text-xs animate-pulse">Consulting the Archives...</div>
        </div>
    );

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400 space-y-6">
                <div className="relative">
                    <span className="text-9xl opacity-10">📖</span>
                    <span className="absolute bottom-0 right-0 text-3xl">🏜️</span>
                </div>
                <p className="text-2xl font-black opacity-20 italic">No menus in the archives yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {history.map((record) => (
                <div
                    key={record.id}
                    onClick={() => onViewMenu(record.menu_data)}
                    className="group bg-white p-8 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border-4 border-white hover:border-violet-200 transition-all cursor-pointer relative overflow-hidden"
                >
                    {/* Delete Button */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <button
                            onClick={(e) => handleDelete(e, record.id)}
                            className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-100"
                            title="Delete from History"
                        >
                            <span className="text-xl">🗑️</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500">ARCHIVED MENU</span>
                                <h3 className="text-2xl font-black text-stone-800 leading-tight group-hover:text-teal-700 transition-colors pr-8">
                                    {record.event_name || record.title}
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="bg-stone-50 px-4 py-2 rounded-xl flex items-center space-x-2 border border-stone-100">
                                <span className="text-sm">👤</span>
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">{record.client_name || 'Anonymous'}</span>
                            </div>
                            <div className="bg-teal-50 px-4 py-2 rounded-xl flex items-center space-x-2 border border-teal-100">
                                <span className="text-sm">🥗</span>
                                <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider">{record.menu_data?.cuisineRegion || 'Fusion'}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-stone-400 pt-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-base text-stone-300">📅</span>
                                <span>{record.event_date || 'TBD'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-base text-stone-300">👥</span>
                                <span>{record.guest_count || '?'} guests</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-stone-50 flex items-center justify-between text-[10px] font-black text-stone-300 uppercase tracking-widest">
                            <span>Saved: {new Date(record.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center space-x-2 text-teal-600 group-hover:text-violet-600 group-hover:translate-x-2 transition-all">
                                <span>Revisit Menu</span>
                                <span className="text-base">➜</span>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
