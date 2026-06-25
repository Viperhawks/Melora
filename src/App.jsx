import React from 'react';
import { AudioProvider } from './context/AudioContext';
import { LibraryProvider } from './context/LibraryContext';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import MobileNav from './components/MobileNav';

function App() {
  return (
    <AudioProvider>
      <LibraryProvider>
        <div className="app-container">
          
          {/* Ambient Background Glow Layer */}
          <div className="bg-ambient-layer">
            <div className="ambient-orb orb-1"></div>
            <div className="ambient-orb orb-2"></div>
            <div className="ambient-orb orb-3"></div>
          </div>

          {/* Core App Sections */}
          <Sidebar />
          <MainContent />
          <Player />
          <MobileNav />
          
        </div>
      </LibraryProvider>
    </AudioProvider>
  );
}

export default App;
