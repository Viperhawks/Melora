import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAudio } from '../context/AudioContext';
import { 
  Heart, 
  Play, 
  FolderPlus, 
  X, 
  Music, 
  Plus 
} from 'lucide-react';

const LibraryView = () => {
  const { 
    likedSongs, 
    playlists, 
    createPlaylist, 
    navigateTo 
  } = useLibrary();

  const { playTrack } = useAudio();

  // Create Playlist Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [playlistCover, setPlaylistCover] = useState('');

  const handlePlayLikedSongs = (e) => {
    e.stopPropagation();
    if (likedSongs.length > 0) {
      playTrack(likedSongs[0], likedSongs);
    }
  };

  const handlePlayPlaylist = (playlist, e) => {
    e.stopPropagation();
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (!playlistName.trim()) return;
    const pl = createPlaylist(playlistName, playlistDesc, playlistCover);
    setPlaylistName('');
    setPlaylistDesc('');
    setPlaylistCover('');
    setIsModalOpen(false);
    
    // Auto-navigate to the new playlist detail
    navigateTo('playlist-detail', pl.id);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* Header */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}
      >
        <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Your Library</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-premium"
        >
          <FolderPlus size={16} /> Create Playlist
        </button>
      </div>

      {/* Main Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr', 
          gap: '32px',
          alignItems: 'start'
        }}
      >
        {/* Liked Songs Large Banner Card (Left) */}
        <div
          onClick={() => likedSongs.length > 0 && navigateTo('playlist-detail', 'liked')}
          style={{
            background: 'linear-gradient(135deg, #1f1f1f 0%, #050505 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '32px 24px 24px 24px',
            height: '320px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            cursor: likedSongs.length > 0 ? 'pointer' : 'default',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            if (likedSongs.length > 0) {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              const btn = e.currentTarget.querySelector('.liked-play-btn');
              if (btn) {
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
              }
            }
          }}
          onMouseLeave={(e) => {
            if (likedSongs.length > 0) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              const btn = e.currentTarget.querySelector('.liked-play-btn');
              if (btn) {
                btn.style.opacity = '0';
                btn.style.transform = 'scale(0.8)';
              }
            }
          }}
        >
          {/* Animated Float icons on back */}
          <div style={{ position: 'absolute', top: '24px', left: '24px', color: 'rgba(255, 255, 255, 0.25)' }} className="pulse-glow">
            <Heart size={48} fill="currentColor" />
          </div>

          <div style={{ zIndex: 10 }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', lineHeight: '1.1' }}>Liked Songs</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'} you've liked.
            </p>
          </div>

          {/* Floating Play Button */}
          {likedSongs.length > 0 && (
            <button
              onClick={handlePlayLikedSongs}
              className="liked-play-btn pulse-glow"
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: '0',
                transform: 'scale(0.8)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              title="Play Liked Songs"
            >
              <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
            </button>
          )}
        </div>

        {/* Custom Playlists View (Right) */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Playlists</h2>
          
          {playlists.length === 0 ? (
            <div 
              style={{ 
                border: '1px dashed rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                padding: '48px 0', 
                textAlign: 'center', 
                color: 'var(--text-secondary)' 
              }}
            >
              <Music size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Create your first playlist</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Organize your music by mood, genre or language.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-premium"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <Plus size={14} /> Create Playlist
              </button>
            </div>
          ) : (
            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {playlists.map(pl => (
                <div
                  key={pl.id}
                  className="music-card"
                  onClick={() => navigateTo('playlist-detail', pl.id)}
                >
                  <div className="music-card-img-container">
                    <img src={pl.cover} alt={pl.name} className="music-card-img" />
                    {pl.tracks.length > 0 && (
                      <div 
                        className="music-card-play-btn"
                        onClick={(e) => handlePlayPlaylist(pl, e)}
                      >
                        <Play size={20} fill="currentColor" style={{ marginLeft: '3px' }} />
                      </div>
                    )}
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pl.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
                    {pl.tracks.length} {pl.tracks.length === 1 ? 'song' : 'songs'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Playlist Creation Glassmorphic Dialog Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '400px',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Create New Playlist</h3>

            <form onSubmit={handleSubmitCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Playlist Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Lofi Vibes"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Description</label>
                <textarea
                  placeholder="Describe your playlist..."
                  value={playlistDesc}
                  onChange={(e) => setPlaylistDesc(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)',
                    minHeight: '80px',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Cover Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="e.g. https://example.com/cover.jpg"
                  value={playlistCover}
                  onChange={(e) => setPlaylistCover(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-premium"
                  style={{ padding: '8px 20px', fontSize: '13px' }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;
