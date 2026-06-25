import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { searchSongs, LANGUAGE_SEARCH_KEYWORDS } from '../utils/api';
import { 
  Search, 
  X, 
  Play, 
  Plus, 
  Clock, 
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';

const SearchView = () => {
  const { playTrack, addToQueue } = useAudio();
  const { playlists, addTrackToPlaylist, likedSongs, toggleLike } = useLibrary();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Debounced search trigger
  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await searchSongs(query);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside to close menus
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLanguageClick = (lang) => {
    const keyword = LANGUAGE_SEARCH_KEYWORDS[lang] || lang;
    setQuery(keyword);
  };

  const handleGenreClick = (genre) => {
    setQuery(`${genre} songs`);
  };

  const formatDuration = (secs) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Genre data list with premium monochrome glass styles
  const genres = [
    { name: 'Lo-Fi Chill', bg: 'linear-gradient(135deg, #1f1f1f 0%, #0d0d0d 100%)' },
    { name: 'Hip Hop', bg: 'linear-gradient(135deg, #3a3a3a 0%, #121212 100%)' },
    { name: 'Electronic', bg: 'linear-gradient(135deg, #4f4f4f 0%, #1a1a1a 100%)' },
    { name: 'Acoustic', bg: 'linear-gradient(135deg, #2b2b2b 0%, #0a0a0a 100%)' },
    { name: 'Lo-Fi Study', bg: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' },
    { name: 'Workout', bg: 'linear-gradient(135deg, #ffffff 0%, #444444 100%)', textDark: true }
  ];

  const languages = [
    { id: 'malayalam', name: 'Malayalam Hits', desc: 'Malayalam cinema & indie hits', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60' },
    { id: 'english', name: 'English Pop', desc: 'Billboard Top charts & pop classics', cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60' },
    { id: 'hindi', name: 'Hindi Romance', desc: 'Bollywood romantic & pop beats', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60' },
    { id: 'tamil', name: 'Tamil Melodies', desc: 'Top AR Rahman, Harris Jayaraj hits', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60' }
  ];

  const handleTrackRowClick = (track, e) => {
    // Avoid playing if clicking on option buttons
    if (e.target.closest('.action-btn')) return;
    playTrack(track, results);
  };

  const toggleTrackMenu = (trackId, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === trackId ? null : trackId);
  };

  const topResult = results[0];
  const listResults = results.slice(1, 6);

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* Search Input Box */}
      <div 
        style={{ 
          position: 'relative', 
          maxWidth: '500px', 
          marginBottom: '32px' 
        }}
      >
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)'
          }} 
        />
        <input
          type="text"
          placeholder="What do you want to play?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 48px 14px 48px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            e.target.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.05)';
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.04)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isLoading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0' }}>
          <div style={{
            width: '30px',
            height: '30px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      )}

      {/* Query is Empty: Display Languages and Genres */}
      {!query && !isLoading && (
        <div>
          {/* Languages Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Languages</h2>
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                gap: '20px' 
              }}
            >
              {languages.map(lang => (
                <div
                  key={lang.id}
                  onClick={() => handleLanguageClick(lang.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img 
                    src={lang.cover} 
                    alt={lang.name} 
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{lang.name}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{lang.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genres Section */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Browse Genres</h2>
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '16px' 
              }}
            >
              {genres.map(genre => (
                <div
                  key={genre.name}
                  onClick={() => handleGenreClick(genre.name)}
                  style={{
                    background: genre.bg,
                    borderRadius: '12px',
                    padding: '20px',
                    height: '110px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                  }}
                >
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: genre.textDark ? '#000000' : '#ffffff' 
                  }}>
                    {genre.name}
                  </h3>
                  <div style={{ alignSelf: 'flex-end', opacity: 0.6, color: genre.textDark ? '#000000' : '#ffffff' }}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Query is Loaded: Show search results split pane */}
      {query && !isLoading && results.length > 0 && (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '400px 1fr', 
            gap: '32px' 
          }}
        >
          {/* Top Result Card */}
          {topResult && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Top Result</h2>
              <div
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
                onClick={() => playTrack(topResult, results)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  const playBtn = e.currentTarget.querySelector('.top-play-btn');
                  if (playBtn) {
                    playBtn.style.opacity = '1';
                    playBtn.style.transform = 'translateY(0)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                  const playBtn = e.currentTarget.querySelector('.top-play-btn');
                  if (playBtn) {
                    playBtn.style.opacity = '0';
                    playBtn.style.transform = 'translateY(8px)';
                  }
                }}
              >
                <img 
                  src={topResult.cover} 
                  alt={topResult.title}
                  style={{ width: '92px', height: '92px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}
                />
                
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', lineHeight: '1.2', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {topResult.title}
                  </h1>
                  <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: 'bold', marginRight: '10px' }}>
                    SONG
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {topResult.artists}
                  </span>
                </div>

                {/* Glass Play button overlay */}
                <div 
                  className="top-play-btn pulse-glow"
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    right: '24px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    opacity: '0',
                    transform: 'translateY(8px)',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                >
                  <Play size={20} fill="currentColor" style={{ marginLeft: '3px' }} />
                </div>
              </div>
            </div>
          )}

          {/* Songs List */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Songs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {listResults.map((track) => (
                <div
                  key={track.id}
                  onClick={(e) => handleTrackRowClick(track, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <img 
                    src={track.cover} 
                    alt={track.title}
                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.artists}
                    </div>
                  </div>

                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginRight: '16px' }}>
                    {formatDuration(track.duration)}
                  </span>

                  {/* Menu Options Button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      className="action-btn"
                      onClick={(e) => toggleTrackMenu(track.id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {/* Track Dropdown Context Menu */}
                    {activeMenuId === track.id && (
                      <div
                        ref={menuRef}
                        className="glass-panel"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          width: '180px',
                          borderRadius: '8px',
                          padding: '6px',
                          zIndex: 90,
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <button
                          onClick={() => {
                            addToQueue(track);
                            setActiveMenuId(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Add to Queue
                        </button>
                        
                        <button
                          onClick={() => {
                            toggleLike(track);
                            setActiveMenuId(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {likedSongs.some(t => t.id === track.id) ? 'Remove from Liked' : 'Add to Liked'}
                        </button>

                        {playlists.length > 0 && (
                          <div 
                            style={{ 
                              borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
                              marginTop: '4px', 
                              paddingTop: '4px' 
                            }}
                          >
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 'bold', padding: '4px 12px', textTransform: 'uppercase' }}>
                              Add to Playlist
                            </div>
                            {playlists.map(pl => (
                              <button
                                key={pl.id}
                                onClick={() => {
                                  addTrackToPlaylist(pl.id, track);
                                  setActiveMenuId(null);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '6px 12px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-secondary)',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  borderRadius: '4px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                              >
                                {pl.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Query has no results */}
      {query && !isLoading && results.length === 0 && (
        <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No results found for "{query}"</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Check your spelling, or try adjusting the query search.</p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SearchView;
