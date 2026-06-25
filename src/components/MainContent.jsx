import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAudio } from '../context/AudioContext';
import HomeView from './HomeView';
import SearchView from './SearchView';
import LibraryView from './LibraryView';
import PlaylistDetailView from './PlaylistDetailView';
import SettingsView from './SettingsView';
import Visualizer from './Visualizer';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  X, 
  Play, 
  Trash2,
  ExternalLink
} from 'lucide-react';

const MainContent = () => {
  const { currentView, navigateTo } = useLibrary();
  const { 
    isQueueDrawerOpen, 
    setIsQueueDrawerOpen, 
    queue, 
    currentIndex, 
    playTrack, 
    removeFromQueue,
    clearQueue 
  } = useAudio();

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'library':
        return <LibraryView />;
      case 'playlist-detail':
        return <PlaylistDetailView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="main-panel glass-panel" style={{ margin: '12px 12px 12px 6px', position: 'relative' }}>
      
      {/* Visualizer Panel overlay */}
      <Visualizer />

      {/* Glass Header Bar */}
      <header 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          background: 'rgba(5, 5, 5, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 40,
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}
      >
        {/* Navigation Mock Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => navigateTo('home')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'not-allowed'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* User profile & external links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="btn-premium"
            style={{
              fontSize: '12px',
              padding: '6px 14px',
              textDecoration: 'none'
            }}
          >
            Open Source <ExternalLink size={12} />
          </a>
          
          <div 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff'
            }}
            title="Profile"
          >
            <User size={16} />
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <div style={{ flex: 1, padding: '24px', zIndex: 10 }}>
        {renderActiveView()}
      </div>

      {/* Sliding Queue Drawer Overlay */}
      {isQueueDrawerOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '320px',
            height: '100%',
            zIndex: 100,
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
          }}
        >
          {/* Drawer Header */}
          <div 
            style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Play Queue</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={clearQueue}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Clear Queue"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsQueueDrawerOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Drawer Queue Tracklist */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {queue.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                Queue is empty
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {queue.map((track, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <div 
                      key={`${track.id}-${idx}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px',
                        borderRadius: '8px',
                        background: isCurrent ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                        border: '1px solid',
                        borderColor: isCurrent ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <img 
                        src={track.cover} 
                        alt={track.title} 
                        style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div 
                        style={{ flex: 1, overflow: 'hidden' }}
                        onClick={() => playTrack(track)}
                      >
                        <div 
                          style={{ 
                            fontSize: '13px', 
                            fontWeight: '500', 
                            color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {track.title}
                        </div>
                        <div 
                          style={{ 
                            fontSize: '11px', 
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {track.artists}
                        </div>
                      </div>
                      
                      {!isCurrent && (
                        <button
                          onClick={() => removeFromQueue(track.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Keyframes for Queue drawer slide-in */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MainContent;
