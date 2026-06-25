import React, { useState } from 'react';
import { getApiBaseUrl, setApiBaseUrl } from '../utils/api';
import { Save, RefreshCw, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

const SettingsView = () => {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [quality, setQuality] = useState(() => {
    return localStorage.getItem('melora_quality') || '320kbps';
  });

  const handleSaveApi = (e) => {
    e.preventDefault();
    setApiBaseUrl(apiUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleQualityChange = (e) => {
    const val = e.target.value;
    setQuality(val);
    localStorage.setItem('melora_quality', val);
  };

  const handleResetData = () => {
    if (window.confirm('WARNING: This will permanently delete all your liked songs and custom playlists. Do you want to proceed?')) {
      localStorage.removeItem('melora_liked_songs');
      localStorage.removeItem('melora_playlists');
      localStorage.removeItem('melora_api_url');
      localStorage.removeItem('melora_quality');
      alert('Application settings reset successfully. Reloading the page.');
      window.location.reload();
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Configure connection endpoints, stream qualities, and local data.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
        
        {/* API Endpoint Configuration Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(255, 255, 255, 0.01)'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>JioSaavn API Server</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Set a self-hosted or alternative public API endpoint. Default: <code>https://saavn.sumit.co</code>
          </p>

          <form onSubmit={handleSaveApi} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="url"
              required
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              style={{
                flex: 1,
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
            <button
              type="submit"
              className="btn-premium"
              style={{ fontSize: '13px', padding: '10px 16px' }}
            >
              <Save size={14} /> Save
            </button>
          </form>

          {saveSuccess && (
            <p style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', marginTop: '10px', textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>
              API Base URL saved successfully!
            </p>
          )}
        </div>

        {/* Audio Quality Configuration Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(255, 255, 255, 0.01)'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Streaming Audio Quality</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Higher bitrate stream requires a faster internet connection.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="radio"
                name="audio-quality"
                value="320kbps"
                checked={quality === '320kbps'}
                onChange={handleQualityChange}
                style={{ cursor: 'pointer', accentColor: '#ffffff' }}
              />
              High Definition (320kbps) - Recommended
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="radio"
                name="audio-quality"
                value="160kbps"
                checked={quality === '160kbps'}
                onChange={handleQualityChange}
                style={{ cursor: 'pointer', accentColor: '#ffffff' }}
              />
              Medium Quality (160kbps)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="radio"
                name="audio-quality"
                value="96kbps"
                checked={quality === '96kbps'}
                onChange={handleQualityChange}
                style={{ cursor: 'pointer', accentColor: '#ffffff' }}
              />
              Data Saver (96kbps)
            </label>
          </div>
        </div>

        {/* Danger Area Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(255, 255, 255, 0.01)'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Danger Zone
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Irreversible actions regarding your library, settings, and cache data.
          </p>

          <button
            onClick={handleResetData}
            style={{
              background: 'rgba(255, 0, 0, 0.05)',
              border: '1px solid rgba(255, 0, 0, 0.2)',
              color: '#ff4d4d',
              padding: '10px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: 'var(--font-body)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#ff4d4d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.2)';
            }}
          >
            <AlertTriangle size={14} /> Reset App Storage Data
          </button>
        </div>

        {/* License & Tech Info Card */}
        <div 
          style={{
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} /> Open-Source Free Platform
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Melora v1.0.0 • Made with <Heart size={10} fill="var(--text-muted)" color="var(--text-muted)" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
