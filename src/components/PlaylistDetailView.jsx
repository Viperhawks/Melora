import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAudio } from '../context/AudioContext';
import { 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Heart, 
  Clock, 
  X,
  Music,
  Plus
} from 'lucide-react';

const PlaylistDetailView = () => {
  const { 
    activePlaylistId, 
    likedSongs, 
    playlists, 
    deletePlaylist,
    removeTrackFromPlaylist,
    updatePlaylistInfo,
    navigateTo 
  } = useLibrary();

  const { currentTrack, isPlaying, playTrack } = useAudio();

  // Dialog edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCover, setEditCover] = useState('');

  // Fetch target playlist
  const getPlaylistData = () => {
    if (activePlaylistId === 'liked') {
      return {
        id: 'liked',
        name: 'Liked Songs',
        description: 'Your personal collection of liked tracks on Melora.',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
        tracks: likedSongs,
        isLikedList: true
      };
    }
    const pl = playlists.find(p => p.id === activePlaylistId);
    return pl ? { ...pl, isLikedList: false } : null;
  };

  const playlist = getPlaylistData();

  if (!playlist) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
        Playlist not found.
      </div>
    );
  }

  const handlePlayPlaylist = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const handleTrackRowPlay = (track) => {
    playTrack(track, playlist.tracks);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updatePlaylistInfo(playlist.id, editName, editDesc, editCover);
    setIsEditing(false);
  };

  const openEditDialog = () => {
    setEditName(playlist.name);
    setEditDesc(playlist.description || '');
    setEditCover(playlist.cover || '');
    setIsEditing(true);
  };

  const formatDuration = (secs) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Calculate total playlist duration
  const getTotalDuration = () => {
    const totalSecs = playlist.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    if (hrs > 0) {
      return `${hrs} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  return (
    <div>
      {/* Header Banner */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '24px', 
          marginBottom: '32px',
          padding: '24px',
          background: 'linear-gradient(to top, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.05) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.04)'
        }}
      >
        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <img src={playlist.cover} alt={playlist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            {playlist.isLikedList ? 'System Playlist' : 'Playlist'}
          </span>
          <h1 
            style={{ 
              fontSize: '48px', 
              fontWeight: '800', 
              color: 'var(--text-primary)', 
              margin: '4px 0 12px 0', 
              lineHeight: '1',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.03em'
            }}
          >
            {playlist.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
            {playlist.description || 'No description provided.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Melora User</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs,</span>
            <span>about {getTotalDuration()}</span>
          </div>
        </div>

        {/* Playlist Action buttons */}
        {!playlist.isLikedList && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={openEditDialog}
              className="btn-premium"
              style={{ padding: '8px 12px', borderRadius: '50%', width: '40px', height: '40px' }}
              title="Edit Details"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={handleDelete}
              className="btn-premium"
              style={{ padding: '8px 12px', borderRadius: '50%', width: '40px', height: '40px' }}
              title="Delete Playlist"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Control Action Bar */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '24px',
          marginBottom: '24px',
          padding: '0 8px'
        }}
      >
        {playlist.tracks.length > 0 && (
          <button
            onClick={handlePlayPlaylist}
            className="pulse-glow"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            title="Play Playlist"
          >
            <Play size={24} fill="currentColor" style={{ marginLeft: '3px' }} />
          </button>
        )}
      </div>

      {/* Tracklist Grid Table */}
      {playlist.tracks.length === 0 ? (
        <div 
          style={{ 
            border: '1px dashed rgba(255,255,255,0.08)', 
            borderRadius: '12px', 
            padding: '60px 0', 
            textAlign: 'center', 
            color: 'var(--text-secondary)',
            margin: '0 8px'
          }}
        >
          <Music size={28} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
          <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>This playlist is empty</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Browse songs and add them using search results options.</p>
          <button 
            onClick={() => navigateTo('search')}
            className="btn-premium"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            Find Songs
          </button>
        </div>
      ) : (
        <div style={{ margin: '0 8px' }}>
          {/* Header Row */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '48px 4fr 3fr 1fr 80px', 
              padding: '8px 16px', 
              fontSize: '11px', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              color: 'var(--text-muted)', 
              letterSpacing: '0.08em',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              marginBottom: '10px'
            }}
          >
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Time</span>
          </div>

          {/* Song list rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {playlist.tracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={`${track.id}-${index}`}
                  className={`track-row ${isCurrent ? 'track-row-active' : ''}`}
                  onClick={() => handleTrackRowPlay(track)}
                >
                  <span style={{ fontSize: '13px' }}>
                    {isCurrent && isPlaying ? (
                      <span className="eq-visualizer">
                        <span className="eq-bar eq-bar-1" />
                        <span className="eq-bar eq-bar-2" />
                        <span className="eq-bar eq-bar-3" />
                      </span>
                    ) : (
                      index + 1
                    )}
                  </span>
                  
                  {/* Title and cover */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <img 
                      src={track.cover} 
                      alt={track.title}
                      style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: isCurrent ? 'var(--text-primary)' : 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {track.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.artists}
                      </div>
                    </div>
                  </div>

                  {/* Album */}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                    {track.album}
                  </span>

                  <span></span>

                  {/* Actions & Time */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 32px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px' }}>{formatDuration(track.duration)}</span>
                    
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (playlist.isLikedList) {
                          likedSongs.some(t => t.id === track.id) && removeTrackFromPlaylist('liked', track.id);
                        } else {
                          removeTrackFromPlaylist(playlist.id, track.id);
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                      title={playlist.isLikedList ? 'Unlike track' : 'Remove from playlist'}
                    >
                      {playlist.isLikedList ? <Heart size={14} fill="#ffffff" color="#ffffff" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Details Dialog Modal */}
      {isEditing && (
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
            <button
              onClick={() => setIsEditing(false)}
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

            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Edit Playlist Details</h3>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Playlist Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
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
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Cover Image URL</label>
                <input
                  type="url"
                  value={editCover}
                  onChange={(e) => setEditCover(e.target.value)}
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
                  onClick={() => setIsEditing(false)}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetailView;
