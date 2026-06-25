import React from 'react';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shuffle, 
  Repeat, 
  Repeat1,
  Volume2, 
  VolumeX, 
  Heart, 
  Tv, 
  ListMusic
} from 'lucide-react';

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffleMode,
    repeatMode,
    isVisualizerOpen,
    isQueueDrawerOpen,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setIsVisualizerOpen,
    setIsQueueDrawerOpen
  } = useAudio();

  const { isLiked, toggleLike } = useLibrary();

  // Helper to format track duration seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeekChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e) => {
    changeVolume(parseFloat(e.target.value));
  };

  if (!currentTrack) {
    return (
      <div className="player-panel glass-panel" style={{ justifyContent: 'center', height: '90px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Select a song to start streaming
        </p>
      </div>
    );
  }

  const liked = isLiked(currentTrack.id);

  return (
    <div className="player-panel glass-panel">
      {/* Track Info (Left) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '300px' }}>
        <div 
          onClick={() => setIsVisualizerOpen(!isVisualizerOpen)}
          style={{ 
            position: 'relative', 
            cursor: 'pointer',
            width: '56px',
            height: '56px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
          className={isPlaying ? 'pulse-glow' : ''}
          title="Open Visualizer"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className={`vinyl-record ${!isPlaying ? 'vinyl-record-paused' : ''}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <h4 
            style={{ 
              fontSize: '14px', 
              color: 'var(--text-primary)', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              marginBottom: '2px',
              fontFamily: 'var(--font-body)'
            }}
          >
            {currentTrack.title}
          </h4>
          <p 
            style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}
          >
            {currentTrack.artists}
          </p>
        </div>
        <button
          onClick={() => toggleLike(currentTrack)}
          style={{
            background: 'transparent',
            border: 'none',
            color: liked ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <Heart size={18} fill={liked ? '#ffffff' : 'transparent'} color={liked ? '#ffffff' : 'currentColor'} />
        </button>
      </div>

      {/* Playback Controls (Middle) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            style={{
              background: 'transparent',
              border: 'none',
              color: shuffleMode ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s'
            }}
            title="Shuffle"
          >
            <Shuffle size={16} />
            {shuffleMode && (
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: '#ffffff'
              }} />
            )}
          </button>

          {/* Prev */}
          <button
            onClick={prevTrack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            title="Previous"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            style={{
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(255, 255, 255, 0.2)',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            className="pulse-glow"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            title="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            style={{
              background: 'transparent',
              border: 'none',
              color: repeatMode !== 'none' ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s'
            }}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            {repeatMode !== 'none' && (
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: '#ffffff'
              }} />
            )}
          </button>
        </div>

        {/* Seek Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '600px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '32px', textAlign: 'right' }}>
            {formatTime(currentTime)}
          </span>
          
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeekChange}
            className="range-slider"
          />

          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '32px' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Utilities Section (Right) */}
      <div className="player-volume-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', width: '300px' }}>
        {/* Toggle Visualizer */}
        <button
          onClick={() => setIsVisualizerOpen(!isVisualizerOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: isVisualizerOpen ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s'
          }}
          title="Toggle Visualizer"
        >
          <Tv size={18} />
        </button>

        {/* Toggle Queue Drawer */}
        <button
          onClick={() => setIsQueueDrawerOpen(!isQueueDrawerOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: isQueueDrawerOpen ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s'
          }}
          title="Toggle Queue"
        >
          <ListMusic size={18} />
        </button>

        {/* Volume Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
          <button
            onClick={toggleMute}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="range-slider"
            style={{ height: '3px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
