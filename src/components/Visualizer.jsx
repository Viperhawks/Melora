import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { X, Maximize2, Sparkles, Music } from 'lucide-react';

const Visualizer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    isVisualizerOpen, 
    setIsVisualizerOpen, 
    analyser 
  } = useAudio();

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activeTab, setActiveTab] = useState('visualizer'); // 'visualizer' | 'lyrics'

  // Standard mock scrolling lyrics for premium display
  const getMockLyrics = () => {
    if (!currentTrack) return [];
    return [
      `[00:02.00] Melora Player - High Fidelity Audio`,
      `[00:10.00] Feel the rhythm flowing through your mind`,
      `[00:18.00] In this black and white world, we design`,
      `[00:25.00] Moving shadows dancing under glass`,
      `[00:32.00] Moments like this, we hope they last`,
      `[00:40.00] Running in circles, seeking the sound`,
      `[00:48.00] Look at this beauty we have found`,
      `[00:55.00] Oh, Melora, play the song again`,
      `[01:03.00] Under the stars, until the end...`,
      `[01:10.00] (Instrumental Solo Visualizer)`,
      `[01:20.00] Floating in the ambient, clear and deep`,
      `[01:28.00] In the resonance, promises we keep`,
      `[01:36.00] Thank you for listening to this stream`,
      `[01:45.00] Building the dream, inside a dream...`
    ];
  };

  useEffect(() => {
    if (!isVisualizerOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set appropriate canvas sizing
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 250;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Audio frequency array
    let bufferLength = 128;
    let dataArray = new Uint8Array(bufferLength);
    
    // Procedural wave helper variable for fallbacks
    let waveOffset = 0;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark transparent overlay
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
      ctx.fillRect(0, 0, width, height);

      if (analyser) {
        // Draw Real-time frequency bars from Web Audio API
        analyser.getByteFrequencyData(dataArray);
        
        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] * 0.7;

          // Monochrome white/grey gradient bar
          const opacity = Math.min(1, barHeight / 150);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7 + 0.1})`;
          
          // Render thin rounded bars
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, 2);
          ctx.fill();

          x += barWidth;
        }
      } else {
        // Fallback: draw standard rolling sine wave when CORS blocks analyser
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        const amplitude = isPlaying ? 40 : 5;
        const frequency = isPlaying ? 0.015 : 0.005;
        const speed = isPlaying ? 0.08 : 0.01;

        waveOffset += speed;

        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * frequency + waveOffset) * amplitude * Math.sin(x * 0.003);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Subtly draw smaller secondary glow waves
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.cos(x * (frequency * 0.7) - waveOffset * 0.5) * (amplitude * 0.6) * Math.sin(x * 0.002);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isVisualizerOpen, analyser, isPlaying]);

  if (!isVisualizerOpen || !currentTrack) return null;

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 90,
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(5, 5, 5, 0.95)',
        display: 'grid',
        gridTemplateRows: '60px 1fr',
        animation: 'slideUp 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
      }}
    >
      {/* Header bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => setActiveTab('visualizer')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'visualizer' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '6px 0',
              borderBottom: activeTab === 'visualizer' ? '2px solid #ffffff' : '2px solid transparent',
              transition: 'all 0.25s'
            }}
          >
            Visualizer
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'lyrics' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '6px 0',
              borderBottom: activeTab === 'lyrics' ? '2px solid #ffffff' : '2px solid transparent',
              transition: 'all 0.25s'
            }}
          >
            Lyrics
          </button>
        </div>

        <button
          onClick={() => setIsVisualizerOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Minimize View"
        >
          <X size={20} />
        </button>
      </div>

      {/* Grid Content split */}
      <div className="visualizer-content">
        {/* Left Side: Dynamic spinning Vinyl artwork */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            style={{ 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.02)',
              border: '10px solid #1a1a1a',
              boxShadow: '0 15px 40px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '28px'
            }}
            className={`vinyl-record ${!isPlaying ? 'vinyl-record-paused' : ''} pulse-glow visualizer-vinyl`}
          >
            {/* Center vinyl tracks */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '5px solid #282828',
              overflow: 'hidden',
              background: '#000000',
              zIndex: 2
            }}>
              <img src={currentTrack.cover} alt="Vinyl Center" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Inner vinyl ridges */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }}></div>
            <div style={{ position: 'absolute', top: '30px', left: '30px', right: '30px', bottom: '30px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)' }}></div>
            <div style={{ position: 'absolute', top: '50px', left: '50px', right: '50px', bottom: '50px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.02)' }}></div>
            
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
            />
          </div>

          <div style={{ textAlign: 'center', maxWidth: '350px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              {currentTrack.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              {currentTrack.artists}
            </p>
          </div>
        </div>

        {/* Right Side: Tab based visualizer or lyrics view */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
          {activeTab === 'visualizer' ? (
            <div>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '16px'
                }}
              >
                <Sparkles size={14} /> Frequency Spectrum Analyser
              </div>
              <div 
                style={{ 
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  padding: '16px',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                }}
              >
                <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginTop: '12px' }}>
                {analyser ? 'Audio Analysis Mode: Active' : 'Audio Stream Safe mode: Active'}
              </p>
            </div>
          ) : (
            /* Glowing scrolling lyrics layout */
            <div 
              style={{ 
                height: '320px', 
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                scrollBehavior: 'smooth'
              }}
              className="main-panel"
            >
              {getMockLyrics().map((lyric, idx) => {
                const cleanText = lyric.replace(/\[\d{2}:\d{2}\.\d{2}\]\s*/, '');
                const isInstrumental = cleanText.startsWith('(');
                return (
                  <p 
                    key={idx}
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-display)',
                      color: isInstrumental ? 'var(--text-muted)' : 'var(--text-primary)',
                      opacity: idx === 3 || idx === 4 ? 1 : 0.45,
                      textShadow: idx === 3 || idx === 4 ? '0 0 10px rgba(255, 255, 255, 0.4)' : 'none',
                      transition: 'all 0.3s'
                    }}
                  >
                    {cleanText}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Visualizer;
