import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAudio } from '../context/AudioContext';
import { 
  Home, 
  Search, 
  Library, 
  Settings, 
  Plus, 
  Heart, 
  Music, 
  Volume2
} from 'lucide-react';

const Sidebar = () => {
  const { 
    currentView, 
    playlists, 
    likedSongs, 
    navigateTo, 
    createPlaylist,
    activePlaylistId
  } = useLibrary();

  const { currentTrack, isPlaying } = useAudio();

  const handleCreatePlaylist = () => {
    const pl = createPlaylist();
    navigateTo('playlist-detail', pl.id);
  };

  return (
    <div className="sidebar-panel glass-panel">
      {/* Brand Logo */}
      <div 
        style={{
          padding: '24px 20px 16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}
        onClick={() => navigateTo('home')}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffffff 0%, #3a3a3a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
        }}>
          <Music size={16} color="#000000" />
        </div>
        <span 
          className="sidebar-text"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(to right, #ffffff, #a0a0a0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Melora
        </span>
      </div>

      {/* Main Navigation */}
      <nav style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={() => navigateTo('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            padding: '12px 16px',
            background: currentView === 'home' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: currentView === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--font-body)',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          <Home size={20} />
          <span className="sidebar-text">Home</span>
        </button>

        <button
          onClick={() => navigateTo('search')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            padding: '12px 16px',
            background: currentView === 'search' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: currentView === 'search' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--font-body)',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          <Search size={20} />
          <span className="sidebar-text">Search</span>
        </button>

        <button
          onClick={() => navigateTo('library')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            padding: '12px 16px',
            background: currentView === 'library' && !activePlaylistId ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: currentView === 'library' && !activePlaylistId ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--font-body)',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          <Library size={20} />
          <span className="sidebar-text">Your Library</span>
        </button>

        <button
          onClick={() => navigateTo('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            padding: '12px 16px',
            background: currentView === 'settings' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: currentView === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--font-body)',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          <Settings size={20} />
          <span className="sidebar-text">Settings</span>
        </button>
      </nav>

      {/* Library Operations Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px 8px 24px',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          marginTop: '12px'
        }}
      >
        <span className="sidebar-text">Library Links</span>
        <button 
          onClick={handleCreatePlaylist}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          title="Create Playlist"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Liked Songs Shortcut */}
      <div style={{ padding: '0 8px' }}>
        <button
          onClick={() => navigateTo('library')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--font-body)',
            fontWeight: '500',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #ffffff 0%, #303030 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
          }}>
            <Heart size={12} fill="#000000" color="#000000" />
          </div>
          <div className="sidebar-text" style={{ flex: 1 }}>
            Liked Songs
          </div>
          {likedSongs.length > 0 && (
            <span style={{
              fontSize: '11px',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2px 6px',
              borderRadius: '10px',
              color: 'var(--text-primary)'
            }}>
              {likedSongs.length}
            </span>
          )}
        </button>
      </div>

      {/* Playlist List Scroller */}
      <div 
        className="sidebar-text"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 8px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}
      >
        {playlists.map(pl => {
          const isActive = activePlaylistId === pl.id;
          return (
            <button
              key={pl.id}
              onClick={() => navigateTo('playlist-detail', pl.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '8px 12px',
                background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                transition: 'all 0.2s',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              <img 
                src={pl.cover} 
                alt={pl.name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  objectFit: 'cover',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent'
                }}
              />
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {pl.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Playing mini panel inside sidebar */}
      {currentTrack && isPlaying && (
        <div 
          className="sidebar-text"
          style={{
            padding: '12px 16px',
            margin: '8px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Volume2 size={16} color="var(--text-primary)" className="pulse-glow" style={{ borderRadius: '50%' }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Playing Now</div>
            <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
