import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <Link to={`/game/${game._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ height: '160px', backgroundColor: '#121212', position: 'relative', overflow: 'hidden' }}>
          {game.coverImage ? (
            <img 
              src={game.coverImage} 
              alt={game.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x225/121212/f5c518?text=${encodeURIComponent(game.title)}` }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#f5c518', fontWeight: 'bold', padding: '20px', textAlign: 'center' }}>
              {game.title}
            </div>
          )}
          
          {/* IMDb Style Bookmark Ribbon */}
          <div style={{ position: 'absolute', top: '-2px', left: '0', cursor: 'pointer', zIndex: 2 }}>
            <svg width="34" height="42" viewBox="0 0 24 30" fill="rgba(0,0,0,0.6)" stroke="#ffffff" strokeWidth="1.5">
              <path d="M0 0h24v30L12 24 0 30z"></path>
              <path d="M12 8v10M7 13h10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path>
            </svg>
          </div>
        </div>
        
        <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Rating Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#f5c518" stroke="#f5c518" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '600' }}>8.5</span>
            <span style={{ color: '#aaa', fontSize: '0.8rem', marginLeft: 'auto' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </span>
          </div>

          <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#fff', fontWeight: '600', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {game.title}
          </h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '0.8rem', color: '#a0a6b5' }}>
            {game.genre}
          </p>
        </div>
      </Link>
      
      {/* Watchlist button outside the link to avoid nested click conflicts */}
      <div style={{ padding: '0 10px 12px 10px', marginTop: 'auto' }}>
        <button style={{ width: '100%', padding: '8px 0', backgroundColor: '#2b2b2b', color: '#5799ef', border: 'none', borderRadius: '4px', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#383838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2b2b2b'}>
          <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>+</span> Watchlist
        </button>
      </div>
    </div>
  );
};

export default GameCard;
