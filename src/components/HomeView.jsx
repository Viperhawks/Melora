import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { getSongsByIds, CURATED_HOMEPAGE_IDS, FALLBACK_TRACKS } from '../utils/api';
import { Play, Music, Sparkles } from 'lucide-react';

const HomeView = () => {
  const { playTrack } = useAudio();
  const { navigateTo } = useLibrary();

  // Curated playlists states
  const [malayalamHits, setMalayalamHits] = useState([]);
  const [englishHits, setEnglishHits] = useState([]);
  const [hindiHits, setHindiHits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchCuratedSongs = async () => {
      setIsLoading(true);
      try {
        const malSongs = await getSongsByIds(CURATED_HOMEPAGE_IDS.malayalam);
        setMalayalamHits(malSongs);

        const engSongs = await getSongsByIds(CURATED_HOMEPAGE_IDS.english);
        setEnglishHits(engSongs);

        const hinSongs = await getSongsByIds(CURATED_HOMEPAGE_IDS.hindi);
        setHindiHits(hinSongs);
      } catch (err) {
        console.error('Error fetching homepage curated tracks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCuratedSongs();
  }, []);

  // Quick Play Cards for the top grid
  const quickMixes = [
    { id: 'mix-malayalam', title: 'Malayalam Top 50', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60', tracks: malayalamHits },
    { id: 'mix-english', title: 'English Favourites', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', tracks: englishHits.length > 0 ? englishHits : FALLBACK_TRACKS },
    { id: 'mix-hindi', title: 'Bollywood Classics', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60', tracks: hindiHits }
  ];

  const handleQuickPlay = (tracks) => {
    if (tracks && tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div>
      {/* Hero Greeting and Subtext */}
      <div style={{ marginBottom: '32px' }}>
        <h1 
          style={{ 
            fontSize: '36px', 
            fontWeight: '800', 
            color: 'var(--text-primary)', 
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {getGreeting()}
          <Sparkles size={24} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Welcome back to Melora. Stream high-fidelity Malayalam and international music.
        </p>
      </div>

      {/* Quick Play 3-Column Grid */}
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Quick Play Mixes</h2>
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '16px',
          marginBottom: '40px'
        }}
      >
        {quickMixes.map(mix => (
          <div 
            key={mix.id}
            onClick={() => handleQuickPlay(mix.tracks)}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              const btn = e.currentTarget.querySelector('.mix-play-btn');
              if (btn) {
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
              const btn = e.currentTarget.querySelector('.mix-play-btn');
              if (btn) {
                btn.style.opacity = '0';
                btn.style.transform = 'scale(0.8)';
              }
            }}
          >
            <img 
              src={mix.image} 
              alt={mix.title} 
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px', flex: 1, overflow: 'hidden' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {mix.title}
              </h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                {mix.tracks.length > 0 ? `${mix.tracks.length} tracks` : 'Loading...'}
              </p>
            </div>
            
            {/* Play Hover Button */}
            <div 
              className="mix-play-btn"
              style={{
                position: 'absolute',
                right: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: '0',
                transform: 'scale(0.8)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Malayalam Hits Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Trending Malayalam</h2>
          <button 
            onClick={() => navigateTo('search')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            See all
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', gap: '20px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ width: '180px', height: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', animation: 'pulse 1.5s infinite alternate' }} />
            ))}
          </div>
        ) : (
          <div className="card-grid">
            {malayalamHits.map((track, idx) => (
              <div 
                key={track.id} 
                className="music-card"
                onClick={() => playTrack(track, malayalamHits)}
              >
                <div className="music-card-img-container">
                  <img src={track.cover} alt={track.title} className="music-card-img" />
                  <div className="music-card-play-btn">
                    <Play size={20} fill="currentColor" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
                  {track.artists}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* English Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Trending English</h2>
        {isLoading ? (
          <div style={{ display: 'flex', gap: '20px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ width: '180px', height: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', animation: 'pulse 1.5s infinite alternate' }} />
            ))}
          </div>
        ) : (
          <div className="card-grid">
            {(englishHits.length > 0 ? englishHits : FALLBACK_TRACKS).map((track) => (
              <div 
                key={track.id} 
                className="music-card"
                onClick={() => playTrack(track, englishHits.length > 0 ? englishHits : FALLBACK_TRACKS)}
              >
                <div className="music-card-img-container">
                  <img src={track.cover} alt={track.title} className="music-card-img" />
                  <div className="music-card-play-btn">
                    <Play size={20} fill="currentColor" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
                  {track.artists}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bollywood Section */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Trending Hindi</h2>
        {isLoading ? (
          <div style={{ display: 'flex', gap: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: '180px', height: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', animation: 'pulse 1.5s infinite alternate' }} />
            ))}
          </div>
        ) : (
          <div className="card-grid">
            {hindiHits.map((track) => (
              <div 
                key={track.id} 
                className="music-card"
                onClick={() => playTrack(track, hindiHits)}
              >
                <div className="music-card-img-container">
                  <img src={track.cover} alt={track.title} className="music-card-img" />
                  <div className="music-card-play-btn">
                    <Play size={20} fill="currentColor" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
                  {track.artists}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default HomeView;
