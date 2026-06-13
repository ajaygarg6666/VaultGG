import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesAPI, sessionsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';
import toast from 'react-hot-toast';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inLibrary, setInLibrary] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const res = await gamesAPI.getById(id);
        setGame(res.data.data);
        
        if (user) {
          const sessionRes = await sessionsAPI.checkGame(id);
          setInLibrary(sessionRes.data.inLibrary);
          if (sessionRes.data.inLibrary) {
            setSession(sessionRes.data.session);
          }
        }
      } catch (error) {
        console.error(error);
        if (error.response?.status === 404) {
          toast.error('Game not found');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id, user, navigate]);

  const handleAddToLibrary = async () => {
    if (!user) {
      toast.error('Please login to add to library');
      return;
    }
    try {
      const res = await sessionsAPI.addToLibrary({ gameId: id });
      setInLibrary(true);
      setSession(res.data.data);
      toast.success('Added to your library!');
    } catch (err) {
      toast.error('Failed to add to library');
    }
  };

  const handleRemoveFromLibrary = async () => {
    try {
      await sessionsAPI.removeFromLibrary(session._id);
      setInLibrary(false);
      setSession(null);
      toast.success('Removed from library');
    } catch (err) {
      toast.error('Failed to remove from library');
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading Game...</div>;
  if (!game) return <div className="container">Game not found</div>;

  return (
    <div className="container" style={{ paddingBottom: '40px', paddingTop: '20px' }}>
      
      {/* IMDb Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', fontWeight: 'bold', color: '#fff' }}>{game.title}</h1>
          <div style={{ display: 'flex', gap: '15px', color: '#a0a6b5', fontSize: '0.9rem', alignItems: 'center' }}>
            <span>{game.releaseYear || '2023'}</span> {/* Fallback if no exact date */}
            <span>•</span>
            <span style={{ border: '1px solid #a0a6b5', padding: '1px 6px', borderRadius: '3px' }}>{game.genre}</span>
            <span>•</span>
            <span>{game.developer}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {/* Mockup IMDb Rating */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#a0a6b5', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px' }}>VaultGG Rating</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#f5c518"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>8.5</span>
              <span style={{ color: '#a0a6b5', fontSize: '1rem', lineHeight: 1 }}>/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Media and Sidebar Layout */}
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '40px' }}>
        
        {/* Cinematic Main Image */}
        <div style={{ flex: '3', minWidth: '320px', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {game.coverImage ? (
            <img 
              src={game.coverImage} 
              alt={game.title} 
              style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#000' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', width: '100%', background: '#121212', color: '#f5c518', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {game.title}
            </div>
          )}
        </div>
        
        {/* Right Sidebar (Buttons & Info) */}
        <div style={{ flex: '1', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {user ? (
            <div style={{ backgroundColor: '#1f1f1f', padding: '15px', borderRadius: '4px', border: '1px solid #333' }}>
              {inLibrary ? (
                <button onClick={handleRemoveFromLibrary} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  In Library
                </button>
              ) : (
                <button onClick={handleAddToLibrary} style={{ width: '100%', padding: '12px', backgroundColor: '#f5c518', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                  <span style={{ fontSize: '1.4rem', lineHeight: '0' }}>+</span> Add to Watchlist
                </button>
              )}
            </div>
          ) : (
            <div style={{ backgroundColor: '#1f1f1f', padding: '15px', borderRadius: '4px', border: '1px solid #333', textAlign: 'center', color: '#a0a6b5', fontSize: '0.9rem' }}>
              Sign in to add this game to your library.
            </div>
          )}

          <div style={{ backgroundColor: '#1f1f1f', padding: '20px', borderRadius: '4px', flex: 1, border: '1px solid #333' }}>
            <p style={{ margin: '0 0 20px 0', color: '#f0f2f5', lineHeight: '1.6', fontSize: '1.05rem' }}>
              {game.description}
            </p>
            
            <h4 style={{ marginBottom: '10px', color: '#fff', fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Available on Platforms:</h4>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              {game.platforms?.map((p, i) => (
                <div key={i} className="platform-tag" style={{ padding: '6px 12px', display: 'inline-flex', flexDirection: 'column', backgroundColor: '#121212', border: '1px solid #333', borderRadius: '3px' }}>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{p.name}</strong>
                  {p.price > 0 && <span style={{ color: '#f5c518', fontSize: '0.8rem' }}>${p.price}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      
      <ReviewSection gameId={game._id} />
    </div>
  );
};

export default GameDetail;
