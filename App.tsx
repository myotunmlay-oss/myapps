
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import { FIREBASE_CONFIG, CURRENT_APP_VERSION } from './constants';
import { AppSettings } from './types';

// Initialize Firebase App and Database
const app = initializeApp(FIREBASE_CONFIG);
const database = getDatabase(app);

export const getThemeClasses = (darknessLevel: 'default' | 'darker' | 'deep-dark') => {
  const themes = {
    'darker': {
      bodyBg: 'bg-[#000000]',
      adminBg: 'bg-[#000000]',
      navBg: 'bg-[#050505]',
      cardBg: 'bg-[#020202]',
      innerBg: 'bg-[#000000]',
      matchCardBg: 'bg-[#030303]',
      matchCardHoverBg: 'hover:bg-[#070707]',
      playerHeaderGradFrom: 'from-[#0a0a0a]',
      playerHeaderGradTo: 'to-[#050505]',
      logoGradFrom: 'from-[#000000]',
      logoGradTo: 'to-[#000000]',
      errorOverlayBg: 'bg-[#000000]',
      matchCardTeamLogoGradFrom: 'from-[#000000]',
      matchCardTeamLogoGradTo: 'to-[#000000]',
    },
    'deep-dark': {
      bodyBg: 'bg-[#000000]',
      adminBg: 'bg-[#000000]',
      navBg: 'bg-[#000000]',
      cardBg: 'bg-[#000000]',
      innerBg: 'bg-[#000000]',
      matchCardBg: 'bg-[#000000]',
      matchCardHoverBg: 'hover:bg-[#080808]',
      playerHeaderGradFrom: 'from-[#050505]',
      playerHeaderGradTo: 'to-[#000000]',
      logoGradFrom: 'from-[#000000]',
      logoGradTo: 'to-[#000000]',
      errorOverlayBg: 'bg-[#000000]',
      matchCardTeamLogoGradFrom: 'from-[#000000]',
      matchCardTeamLogoGradTo: 'to-[#000000]',
    },
    'default': {
      bodyBg: 'bg-[#080808]',
      adminBg: 'bg-[#060606]',
      navBg: 'bg-[#1a1a1a]',
      cardBg: 'bg-[#101010]',
      innerBg: 'bg-[#0a0a0a]',
      matchCardBg: 'bg-[#121212]',
      matchCardHoverBg: 'hover:bg-[#181818]',
      playerHeaderGradFrom: 'from-[#222]',
      playerHeaderGradTo: 'to-[#1a1a1a]',
      logoGradFrom: 'from-[#101010]',
      logoGradTo: 'to-[#0c0c0c]',
      errorOverlayBg: 'bg-[#0a0a0a]',
      matchCardTeamLogoGradFrom: 'from-[#101010]',
      matchCardTeamLogoGradTo: 'to-[#0c0c0c]',
    }
  };
  return themes[darknessLevel] || themes.default;
};

const App: React.FC = () => {
  const [route, setRoute] = useState<'user' | 'admin'>('user');
  const [appSettings, setAppSettings] = useState<Partial<AppSettings>>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const themeClasses = useMemo(() => 
    getThemeClasses(appSettings.app_background_darkness || 'default'), 
    [appSettings.app_background_darkness]
  );

  useEffect(() => {
    // Single source of truth for settings
    const settingsRef = ref(database, 'settings');
    const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setAppSettings(data);
      setIsInitialLoad(false);
    });

    const handleLocationChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash.startsWith('#/admin')) {
        setRoute('admin');
        document.title = "Admin Portal | MyTV";
      } else {
        setRoute('user');
        document.title = "MyTV Live Football";
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleLocationChange);
    handleLocationChange();
    
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      unsubscribeSettings();
    };
  }, []);

  const isUpdateRequired = useMemo(() => {
    if (!appSettings.app_version || !appSettings.force_update) return false;
    return appSettings.app_version !== CURRENT_APP_VERSION;
  }, [appSettings.app_version, appSettings.force_update]);

  if (isInitialLoad) {
    return (
      <div className="fixed inset-0 bg-[#080808] flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-[#00ff88]/10 border-t-[#00ff88] rounded-full animate-spin"></div>
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Initializing System...</p>
      </div>
    );
  }

  if (isUpdateRequired && route === 'user') {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#111] border border-white/5 p-10 rounded-[2.5rem] space-y-8 animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-[#00ff88]/10 rounded-full flex items-center justify-center mx-auto border border-[#00ff88]/20 text-4xl">🚀</div>
           <div className="space-y-4">
              <h2 className="text-2xl font-black text-[#00ff88] uppercase italic">Update Required</h2>
              <p className="text-sm text-gray-400 leading-relaxed font-bold">
                {appSettings.update_message || "ဗားရှင်းအသစ်ထွက်ရှိထားပါသဖြင့် အက်ပ်ကို အဆင့်မြှင့်တင်ပေးရန် လိုအပ်ပါသည်။"}
              </p>
           </div>
           <a 
             href={appSettings.update_url || '#'} 
             className="block w-full py-5 bg-[#00ff88] text-black font-black uppercase text-sm rounded-2xl shadow-xl shadow-[#00ff88]/20 active:scale-95 transition-all"
           >
             Download Now
           </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full font-sans selection:bg-[#00ff88]/30 overflow-x-hidden">
      {route === 'admin' ? (
        <AdminPage 
          onExit={() => { window.location.hash = ''; }} 
          themeClasses={themeClasses} 
        />
      ) : (
        <UserPage 
          themeClasses={themeClasses} 
          settings={appSettings} 
        />
      )}
    </div>
  );
};

export default App;
