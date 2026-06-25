// Melora API Utilities
// Interacts with the public JioSaavn API wrapper or falls back to curated royalty-free tracks

// Default API Base URL (can be customized in Settings)
let apiBaseUrl = localStorage.getItem('melora_api_url') || 'https://saavn.sumit.co';

export const getApiBaseUrl = () => apiBaseUrl;

export const setApiBaseUrl = (url) => {
  apiBaseUrl = url.trim().replace(/\/$/, '');
  localStorage.setItem('melora_api_url', apiBaseUrl);
};

// Royalty-free fallback tracks to ensure the player works in any environment
export const FALLBACK_TRACKS = [
  {
    id: 'fallback-1',
    title: 'Lost in the City',
    artists: 'Synthwave Soundscape',
    album: 'Neon Horizons',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    language: 'english',
    year: '2023',
    isFallback: true
  },
  {
    id: 'fallback-2',
    title: 'Night Drive',
    artists: 'Retro Beats',
    album: 'Midnight Cruise',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    language: 'english',
    year: '2023',
    isFallback: true
  },
  {
    id: 'fallback-3',
    title: 'Summer Breeze',
    artists: 'Acoustic Dreams',
    album: 'Golden Hour',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 302,
    language: 'english',
    year: '2022',
    isFallback: true
  },
  {
    id: 'fallback-4',
    title: 'Deep Space Chill',
    artists: 'Astral Wave',
    album: 'Cosmic Ambient',
    cover: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop&q=60',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 318,
    language: 'english',
    year: '2024',
    isFallback: true
  },
  {
    id: 'fallback-5',
    title: 'Ethereal Forest',
    artists: 'Nature Sounds',
    album: 'Quiet Earth',
    cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=60',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    duration: 494,
    language: 'english',
    year: '2021',
    isFallback: true
  }
];

// Helper to format track objects returned from the JioSaavn API
export const formatTrack = (song) => {
  if (!song) return null;
  
  // Extract primary artists list
  let artistsName = 'Unknown Artist';
  if (song.artists && song.artists.primary && song.artists.primary.length > 0) {
    artistsName = song.artists.primary.map(a => a.name).join(', ');
  } else if (song.artists && typeof song.artists === 'string') {
    artistsName = song.artists;
  } else if (song.artist) {
    artistsName = song.artist;
  }

  // Get cover image (prefer high quality)
  let coverUrl = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60';
  if (song.image && song.image.length > 0) {
    // JioSaavn wrapper returns array of images with qualities (50x50, 150x150, 500x500)
    coverUrl = song.image[song.image.length - 1]?.url || song.image[0]?.url;
  }

  // Get download/audio URL (prefer 320kbps or 160kbps)
  let audioUrl = '';
  if (song.downloadUrl && song.downloadUrl.length > 0) {
    audioUrl = song.downloadUrl[song.downloadUrl.length - 1]?.url || song.downloadUrl[0]?.url;
  }

  return {
    id: song.id,
    title: song.name || song.title || 'Untitled',
    artists: artistsName,
    album: song.album?.name || song.album || 'Single',
    cover: coverUrl,
    audio: audioUrl,
    duration: song.duration || 0,
    language: song.language || 'unknown',
    year: song.year || '',
    isFallback: false
  };
};

// Search songs by query
export const searchSongs = async (query) => {
  if (!query || query.trim() === '') return [];
  try {
    const res = await fetch(`${apiBaseUrl}/api/search/songs?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    if (data.success && data.data && data.data.results) {
      return data.data.results.map(formatTrack);
    }
    return [];
  } catch (error) {
    console.error('API Error searching songs:', error);
    // Filter fallback tracks by query as client-side search fallback
    return FALLBACK_TRACKS.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artists.toLowerCase().includes(query.toLowerCase()) ||
      track.album.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Get details for specific song ID
export const getSongDetails = async (id) => {
  if (!id) return null;
  if (id.startsWith('fallback-')) {
    return FALLBACK_TRACKS.find(t => t.id === id) || null;
  }
  try {
    const res = await fetch(`${apiBaseUrl}/api/songs/${id}`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    if (data.success && data.data && data.data.length > 0) {
      return formatTrack(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error('API Error getting song details:', error);
    return null;
  }
};

// Get details for a list of song IDs
export const getSongsByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];
  
  const results = [];
  const apiIds = [];
  
  // Split fallback from api IDs
  ids.forEach(id => {
    if (id.startsWith('fallback-')) {
      const fb = FALLBACK_TRACKS.find(t => t.id === id);
      if (fb) results.push(fb);
    } else {
      apiIds.push(id);
    }
  });

  if (apiIds.length === 0) return results;

  try {
    // Saavn API accepts comma separated IDs
    const res = await fetch(`${apiBaseUrl}/api/songs/${apiIds.join(',')}`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    if (data.success && data.data) {
      const formatted = data.data.map(formatTrack);
      results.push(...formatted);
    }
  } catch (error) {
    console.error('API Error getting multiple songs details:', error);
  }
  
  return results;
};

// Fetch playlist details
export const getPlaylistDetails = async (id) => {
  try {
    const res = await fetch(`${apiBaseUrl}/api/playlists?id=${id}`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    if (data.success && data.data) {
      return {
        id: data.data.id,
        name: data.data.name,
        description: data.data.description || '',
        cover: data.data.image?.[2]?.url || data.data.image?.[0]?.url || '',
        tracks: (data.data.songs || []).map(formatTrack)
      };
    }
    return null;
  } catch (error) {
    console.error('API Error getting playlist details:', error);
    return null;
  }
};

// Fetch album details
export const getAlbumDetails = async (id) => {
  try {
    const res = await fetch(`${apiBaseUrl}/api/albums?id=${id}`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    if (data.success && data.data) {
      return {
        id: data.data.id,
        name: data.data.name,
        artists: data.data.primaryArtists || '',
        cover: data.data.image?.[2]?.url || data.data.image?.[0]?.url || '',
        tracks: (data.data.songs || []).map(formatTrack)
      };
    }
    return null;
  } catch (error) {
    console.error('API Error getting album details:', error);
    return null;
  }
};

// Predefined song list for Home / Curation Views
export const CURATED_HOMEPAGE_IDS = {
  malayalam: [
    'RRo9528e', // Engotta (Balan - The Boy)
    'y-0pauOM', // KALYANI
    'Xed6wo6a', // Minnalvala (Narivetta)
    'RUcr3T73', // Amsham
    'mszcr_k4', // Makane Makane
    'BgmrcrEp'  // Badass (Leo)
  ],
  english: [
    'DoCROQ-Q', // Starboy (The Weeknd)
    'NLv5Bok4', // Golden Hour Girl (Taylor Swift)
    'mrVwQcNF', // City of Mirrors (The Weeknd)
    'uDaGzdlW', // Cardigan (8-bit)
    'Gyf18-ky', // Sweet Song (Taylor Swift)
    'U8uPHgQH', // Hawai (The Weeknd)
    'fallback-1', // Fallback 1
    'fallback-2'  // Fallback 2
  ],
  hindi: [
    'Y0p4D0_Z', // Tauba Tauba (Bad Newz)
    'aZz4-s1W', // Aaj Ki Raat (Stree 2)
    'q0m4o-bW'  // Kesariya (Brahmastra)
  ]
};

// Quick language tags query keywords
export const LANGUAGE_SEARCH_KEYWORDS = {
  malayalam: 'malayalam hit songs 2026',
  english: 'billboard hot 100 pop',
  hindi: 'hindi hit songs romantic 2025',
  tamil: 'tamil love hits melodies'
};
