import React, { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext(null);

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'search' | 'library' | 'settings' | 'playlist-detail'
  const [activePlaylistId, setActivePlaylistId] = useState(null);

  // Library State
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem('melora_liked_songs');
    return saved ? JSON.parse(saved) : [];
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('melora_playlists');
    return saved ? JSON.parse(saved) : [
      // Create a default starter playlist
      {
        id: 'default-playlist-1',
        name: 'Chill Melodies',
        description: 'Your default relaxing acoustic and synthwave sounds.',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
        tracks: []
      }
    ];
  });

  // Persist liked songs
  useEffect(() => {
    localStorage.setItem('melora_liked_songs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Persist custom playlists
  useEffect(() => {
    localStorage.setItem('melora_playlists', JSON.stringify(playlists));
  }, [playlists]);

  // Navigation helpers
  const navigateTo = (view, playlistId = null) => {
    setCurrentView(view);
    if (playlistId) {
      setActivePlaylistId(playlistId);
    } else {
      setActivePlaylistId(null);
    }
  };

  // Liked Songs Management
  const isLiked = (trackId) => likedSongs.some(track => track.id === trackId);

  const toggleLike = (track) => {
    if (!track) return;
    setLikedSongs(prev => {
      if (isLiked(track.id)) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  // Custom Playlists Management
  const createPlaylist = (name, description = '', cover = '') => {
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: name || `My Playlist #${playlists.length + 1}`,
      description: description || 'A custom playlist created on Melora.',
      cover: cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60',
      tracks: []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (activePlaylistId === playlistId) {
      navigateTo('library');
    }
  };

  const addTrackToPlaylist = (playlistId, track) => {
    if (!track) return;
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        // Avoid adding duplicates
        const exists = pl.tracks.some(t => t.id === track.id);
        if (exists) return pl;
        return {
          ...pl,
          tracks: [...pl.tracks, track]
        };
      }
      return pl;
    }));
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        return {
          ...pl,
          tracks: pl.tracks.filter(t => t.id !== trackId)
        };
      }
      return pl;
    }));
  };

  const updatePlaylistInfo = (playlistId, name, description, cover) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        return {
          ...pl,
          name: name || pl.name,
          description: description !== undefined ? description : pl.description,
          cover: cover || pl.cover
        };
      }
      return pl;
    }));
  };

  return (
    <LibraryContext.Provider value={{
      currentView,
      activePlaylistId,
      likedSongs,
      playlists,
      navigateTo,
      toggleLike,
      isLiked,
      createPlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      updatePlaylistInfo
    }}>
      {children}
    </LibraryContext.Provider>
  );
};
