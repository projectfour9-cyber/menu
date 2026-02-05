
import React, { useState, useCallback, useEffect } from 'react';
import { MenuPreferences, GeneratedMenu } from './types';
import { fetchMenuFromBackend, supabase, getUserProfile, saveMenuToHistory } from './services/supabaseService';
import { MenuForm } from './components/MenuForm';
import { MenuPreview } from './components/MenuPreview';
import { Loader } from './components/Loader';
import { DishBank } from './components/DishBank';
import { Auth } from './components/Auth';
import { MenuHistory } from './components/MenuHistory';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'staff' | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [menu, setMenu] = useState<GeneratedMenu | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('New Menu');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getUserProfile(session.user.id).then(profile => setUserRole(profile?.role || 'staff'));
      }
      setAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        getUserProfile(session.user.id).then(profile => setUserRole(profile?.role || 'staff'));
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
      setSession(null);
    } catch (e) {
      console.error('Logout failed:', e);
      setSession(null);
    }
  };

  const handleGenerateMenu = useCallback(async (prefs: MenuPreferences) => {
    setIsLoading(true);
    setError(null);
    setMenu(null);
    setImageUrl(null);

    try {
      // Everything is now fetched in one clean go from the backend/database
      const menuData = await fetchMenuFromBackend(prefs);
      setMenu(menuData);
      // Use the banner URL provided by the service instead of generating one
      setImageUrl(menuData.vibeDescription);

      // Save to history
      await saveMenuToHistory(prefs, menuData);
    } catch (err: any) {
      setError(err.message || "Oops! The kitchen caught fire. Try again?");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewHistoryMenu = (menuData: GeneratedMenu) => {
    setMenu(menuData);
    setImageUrl(menuData.vibeDescription);
    setActiveTab('New Menu'); // Switch to "New Menu" tab view so the previewer shows
  };

  const NavItem = ({ icon, label }: { icon: string, label: string }) => (
    <button
      onClick={() => { setActiveTab(label); setMenu(null); setError(null); }}
      className={`flex lg:flex-row flex-col items-center lg:space-x-3 space-x-0 lg:justify-start justify-center px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all w-full ${activeTab === label
        ? 'bg-gradient-to-r from-teal-600 to-violet-600 text-white shadow-lg shadow-teal-200'
        : 'text-stone-500 hover:bg-teal-50'
        }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] lg:text-sm font-bold">{label}</span>
    </button>
  );

  if (authChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="text-6xl animate-spin">🥘</div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-50 relative">
      <div className="blob animate-float w-[500px] h-[500px] bg-teal-200 top-[-200px] right-[-100px] fixed opacity-30"></div>
      <div className="blob animate-float w-[400px] h-[400px] bg-violet-200 bottom-[-100px] left-[-100px] fixed opacity-30" style={{ animationDelay: '-5s' }}></div>







      {/* DESKTOP SIDEBAR */}
      <nav className="hidden lg:flex flex-col fixed left-6 top-6 bottom-6 w-64 bg-gradient-to-b from-teal-50/90 to-violet-50/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-[300] no-print justify-between h-[calc(100vh-3rem)]">
        <div className="space-y-8">
          <div className="flex items-center space-x-3 pl-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-violet-600 rounded-xl flex items-center justify-center text-xl shadow-lg text-white">🥗</div>
            <span className="font-black text-stone-800 tracking-tight">Wedding Kitchen</span>
          </div>

          <div className="space-y-2">
            <NavItem label="New Menu" icon="✨" />
            <NavItem label="Item Bank" icon="🏦" />
            <NavItem label="History" icon="📖" />
            <NavItem label="Brand" icon="🎨" />
          </div>
        </div>

        <div className="space-y-4">
          {userRole && (
            <div className="px-4 py-3 bg-white/50 rounded-2xl border border-white/50 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block mb-1">Logged in as</span>
              <span className={`text-xs font-bold ${userRole === 'admin' ? 'text-teal-700' : 'text-stone-600'}`}>{userRole.toUpperCase()}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-white/50 hover:bg-teal-100 hover:text-teal-700 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-stone-500 transition-all"
          >
            <span>Logout 🚪</span>
          </button>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] no-print w-[90%] max-w-sm">
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl px-2 py-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <NavItem label="New Menu" icon="✨" />
          <NavItem label="Item Bank" icon="🏦" />
          <NavItem label="History" icon="📖" />
          <NavItem label="Brand" icon="🎨" />
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all text-slate-500 hover:bg-slate-100"
          >
            <span className="text-2xl">🚪</span>
            <span className="text-[10px] lg:text-sm font-bold">Exit</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 lg:p-12 relative lg:ml-72">
        <div className="max-w-5xl mx-auto pb-32">
          {error && (
            <div className="mb-8 p-4 md:p-6 bg-red-50 border-4 border-white rounded-[2rem] text-red-700 shadow-xl flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-4">
                <span className="text-2xl md:text-4xl">🌵</span>
                <p className="font-bold text-sm md:text-base">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm text-red-800">Dismiss</button>
            </div>
          )}

          {activeTab === 'New Menu' && !menu && !isLoading ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-3 mb-8 no-print">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-violet-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-teal-200">🥗</div>
                <span className="text-3xl font-black text-stone-800 tracking-tighter">Create the Dream Menu</span>
              </div>
              <MenuForm onSubmit={handleGenerateMenu} isLoading={isLoading} />
            </div>
          ) : activeTab === 'Item Bank' ? (
            <DishBank userRole={userRole} />
          ) : activeTab === 'History' ? (
            <MenuHistory onViewMenu={handleViewHistoryMenu} />
          ) : isLoading ? (
            <div className="min-h-[500px] flex items-center justify-center bg-white rounded-[3rem] shadow-xl border-8 border-white">
              <Loader />
            </div>
          ) : menu ? (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between no-print">
                <button
                  onClick={() => setMenu(null)}
                  className="group flex items-center space-x-3 text-sm font-black text-teal-700 hover:text-violet-700 transition-all bg-white px-5 py-2.5 rounded-full shadow-sm"
                >
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">⬅️</span>
                  <span>Start Over</span>
                </button>
              </div>
              <MenuPreview menu={menu} onUpdate={setMenu} imageUrl={imageUrl} userRole={userRole || 'staff'} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400 space-y-6">
              <span className="text-9xl opacity-10">🧁</span>
              <p className="text-2xl font-black opacity-20 italic">The lab is open!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
