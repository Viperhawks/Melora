import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Home, Search, Library, Settings } from 'lucide-react';

const MobileNav = () => {
  const { currentView, navigateTo } = useLibrary();

  const navItems = [
    { view: 'home', label: 'Home', icon: Home },
    { view: 'search', label: 'Search', icon: Search },
    { view: 'library', label: 'Library', icon: Library },
    { view: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="mobile-nav glass-panel mobile-only">
      {navItems.map((item) => {
        const Icon = item.icon;
        // Treat playlist-detail as active within the Library tab
        const isActive = currentView === item.view || (item.view === 'library' && currentView === 'playlist-detail');
        
        return (
          <button
            key={item.view}
            onClick={() => navigateTo(item.view)}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: '500' }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileNav;
