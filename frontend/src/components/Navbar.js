import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#121212', padding: '10px 0', borderBottom: '1px solid #2a2f3a', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex items-center justify-between">
        <Link to="/" style={{ textDecoration: 'none' }}>
          {/* IMDb-style Logo */}
          <div style={{ 
            backgroundColor: '#f5c518', 
            color: '#000000', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontWeight: '900', 
            fontSize: '1.4rem', 
            letterSpacing: '-0.5px',
            fontFamily: 'Arial Black, Impact, sans-serif',
            display: 'inline-block'
          }}>
            VaultGG
          </div>
        </Link>

        {/* Navigation Links with Icons */}
        <div className="flex items-center gap-lg">
          <Link to="/" style={{ color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Catalog
          </Link>
          <Link to="/stats" style={{ color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10"></path>
              <path d="M18 20V4"></path>
              <path d="M6 20v-4"></path>
            </svg>
            Stats
          </Link>
          
          {user ? (
            <>
              <Link to="/library" style={{ color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                My Library
              </Link>
              <div className="flex items-center gap-md" style={{ marginLeft: '10px', paddingLeft: '20px', borderLeft: '1px solid #2a2f3a' }}>
                <img 
                  src={user.profile?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} 
                  alt="avatar" 
                  style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#20242d' }}
                />
                <span style={{ fontWeight: '600', color: '#fff' }}>{user.username}</span>
                <button onClick={handleLogout} className="btn" style={{ marginLeft: '10px', padding: '6px 12px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #2a2f3a' }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-sm" style={{ marginLeft: '10px', paddingLeft: '20px', borderLeft: '1px solid #2a2f3a' }}>
              <Link to="/login" style={{ color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Sign In
              </Link>
              <Link to="/register" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: '600', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
