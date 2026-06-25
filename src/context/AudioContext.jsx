import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  
  // Audio state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(parseFloat(localStorage.getItem('melora_volume')) || 0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  // Queue state
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]); // Keeps track of un-shuffled queue
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none' | 'all' | 'one'
  const [playHistory, setPlayHistory] = useState([]);
  
  // UI states
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false);

  // Web Audio Visualizer API ref
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const [analyser, setAnalyser] = useState(null);

  // Synchronize initial volume and crossOrigin setting
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    // Set crossOrigin to anonymous to enable Web Audio visualizer for external streaming links
    audio.crossOrigin = 'anonymous';

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => handleTrackEnded();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [queue, currentIndex, repeatMode]);

  // Handle local storage for volume changes
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
    localStorage.setItem('melora_volume', volume);
  }, [volume, isMuted]);

  // Lazy Web Audio API initialization
  const initVisualizerNode = () => {
    if (audioContextRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const ana = ctx.createAnalyser();
      ana.fftSize = 256; // High frequency resolution
      
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(ana);
      ana.connect(ctx.destination);
      
      audioContextRef.current = ctx;
      analyserRef.current = ana;
      sourceRef.current = source;
      setAnalyser(ana);
    } catch (e) {
      console.warn('Web Audio API could not be initialized due to CORS or security limits. Falling back to CSS visualization.', e);
    }
  };

  // Play a specific track
  const playTrack = async (track, playlistTracks = []) => {
    if (!track) return;
    
    // Lazy initialize visualizer
    initVisualizerNode();
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    try {
      const audio = audioRef.current;
      audio.src = track.audio;
      
      // Save current track details
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Load and play
      await audio.load();
      await audio.play();

      // Update queue context if custom track playlist is supplied
      if (playlistTracks.length > 0) {
        setOriginalQueue(playlistTracks);
        if (shuffleMode) {
          // Keep current track at first, shuffle the rest
          const remaining = playlistTracks.filter(t => t.id !== track.id);
          const shuffled = [...remaining].sort(() => Math.random() - 0.5);
          const newQueue = [track, ...shuffled];
          setQueue(newQueue);
          setCurrentIndex(0);
        } else {
          setQueue(playlistTracks);
          const idx = playlistTracks.findIndex(t => t.id === track.id);
          setCurrentIndex(idx !== -1 ? idx : 0);
        }
      } else {
        // If single song clicked, verify it exists in queue
        const idx = queue.findIndex(t => t.id === track.id);
        if (idx !== -1) {
          setCurrentIndex(idx);
        } else {
          // If not in queue, add and set as current
          const newQueue = [...queue];
          newQueue.splice(currentIndex + 1, 0, track);
          setQueue(newQueue);
          setCurrentIndex(currentIndex + 1);
        }
      }

      // Add to play history (avoid duplicates)
      setPlayHistory(prev => {
        const filtered = prev.filter(t => t.id !== track.id);
        return [track, ...filtered].slice(0, 50); // limit to 50
      });
      
    } catch (err) {
      console.error('Playback Error:', err);
      setIsPlaying(false);
    }
  };

  // Toggle Play/Pause
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Play Resume Error:', err);
      }
    }
  };

  // Next Track
  const nextTrack = () => {
    if (queue.length === 0) return;
    
    let nextIdx = currentIndex + 1;
    if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        return; // End of queue
      }
    }
    
    setCurrentIndex(nextIdx);
    playTrack(queue[nextIdx]);
  };

  // Previous Track
  const prevTrack = () => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      // If song played for more than 3s, restart it
      seek(0);
      return;
    }

    if (queue.length === 0) return;
    
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      if (repeatMode === 'all') {
        prevIdx = queue.length - 1;
      } else {
        seek(0);
        return;
      }
    }
    
    setCurrentIndex(prevIdx);
    playTrack(queue[prevIdx]);
  };

  // Track Ended Handler
  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      seek(0);
      audioRef.current.play().catch(e => console.error(e));
    } else {
      nextTrack();
    }
  };

  // Seek
  const seek = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  // Change Volume
  const changeVolume = (val) => {
    const cleanVal = Math.max(0, Math.min(1, val));
    setVolume(cleanVal);
    setIsMuted(cleanVal === 0);
  };

  // Toggle Mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle Shuffle
  const toggleShuffle = () => {
    if (queue.length === 0) {
      setShuffleMode(!shuffleMode);
      return;
    }

    const currentTrackCopy = currentTrack;
    if (!shuffleMode) {
      // Turn Shuffle ON
      const remaining = originalQueue.filter(t => t.id !== currentTrackCopy?.id);
      const shuffled = [...remaining].sort(() => Math.random() - 0.5);
      const newQueue = currentTrackCopy ? [currentTrackCopy, ...shuffled] : shuffled;
      setQueue(newQueue);
      setCurrentIndex(currentTrackCopy ? 0 : -1);
    } else {
      // Turn Shuffle OFF
      setQueue(originalQueue);
      const idx = originalQueue.findIndex(t => t.id === currentTrackCopy?.id);
      setCurrentIndex(idx);
    }
    setShuffleMode(!shuffleMode);
  };

  // Cycle Repeat Modes: none -> all -> one -> none
  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  // Add a single track to the end of the queue
  const addToQueue = (track) => {
    if (!track) return;
    setQueue(prev => [...prev, track]);
    setOriginalQueue(prev => [...prev, track]);
    if (currentIndex === -1) {
      setCurrentIndex(0);
      playTrack(track);
    }
  };

  // Remove a track from the queue
  const removeFromQueue = (id) => {
    setQueue(prev => {
      const idx = prev.findIndex(t => t.id === id);
      if (idx === -1) return prev;
      const newQueue = prev.filter(t => t.id !== id);
      if (idx === currentIndex) {
        // Playing song was removed, skip next
        setTimeout(() => nextTrack(), 50);
      } else if (idx < currentIndex) {
        setCurrentIndex(currentIndex - 1);
      }
      return newQueue;
    });
  };

  // Clear queue
  const clearQueue = () => {
    setQueue(currentTrack ? [currentTrack] : []);
    setOriginalQueue(currentTrack ? [currentTrack] : []);
    setCurrentIndex(currentTrack ? 0 : -1);
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      queue,
      currentIndex,
      shuffleMode,
      repeatMode,
      playHistory,
      isVisualizerOpen,
      isQueueDrawerOpen,
      analyser,
      setIsVisualizerOpen,
      setIsQueueDrawerOpen,
      playTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      seek,
      changeVolume,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      addToQueue,
      removeFromQueue,
      clearQueue
    }}>
      {children}
    </AudioContext.Provider>
  );
};
