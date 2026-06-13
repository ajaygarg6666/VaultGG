import React, { useState, useEffect } from 'react';
import { sessionsAPI } from '../api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyLibrary = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for updating session
  const [editingId, setEditingId] = useState(null);
  const [editHours, setEditHours] = useState(0);
  const [editCompleted, setEditCompleted] = useState(false);

  const fetchLibrary = async () => {
    try {
      const res = await sessionsAPI.getLibrary();
      setSessions(res.data.data);
    } catch (err) {
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleEditClick = (session) => {
    setEditingId(session._id);
    setEditHours(session.hoursPlayed);
    setEditCompleted(session.completed);
  };

  const handleSave = async (id) => {
    try {
      await sessionsAPI.updateSession(id, { hoursPlayed: editHours, completed: editCompleted });
      toast.success('Progress updated');
      setEditingId(null);
      fetchLibrary();
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this game from your library?')) return;
    try {
      await sessionsAPI.removeFromLibrary(id);
      toast.success('Removed from library');
      fetchLibrary();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading Library...</div>;

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      <h1 style={{ margin: '40px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>My Library</h1>
      
      {sessions.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px' }}>Your library is empty</h3>
          <p style={{ marginBottom: '20px' }}>Start adding games to track your playtime and completion!</p>
          <Link to="/" className="btn btn-primary">Browse Catalog</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {sessions.map(session => (
            <div key={session._id} className="card animate-fade-in" style={{ padding: '20px', borderLeft: session.completed ? '4px solid var(--success)' : '4px solid var(--warning)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '15px' }}>
                <Link to={`/game/${session.gameId?._id}`} style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {session.gameId?.title || 'Unknown Game'}
                </Link>
                {session.completed && (
                  <span style={{ backgroundColor: 'var(--success)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>COMPLETED</span>
                )}
              </div>
              
              {editingId === session._id ? (
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '15px', borderRadius: 'var(--radius-md)' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Hours Played</label>
                    <input 
                      type="number" 
                      min="0"
                      className="form-control" 
                      style={{ padding: '8px' }}
                      value={editHours} 
                      onChange={(e) => setEditHours(e.target.value)} 
                    />
                  </div>
                  <div className="form-group flex items-center gap-sm" style={{ marginBottom: '15px' }}>
                    <input 
                      type="checkbox" 
                      id={`completed-${session._id}`}
                      checked={editCompleted}
                      onChange={(e) => setEditCompleted(e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <label htmlFor={`completed-${session._id}`} style={{ margin: 0, cursor: 'pointer' }}>Mark as Completed</label>
                  </div>
                  <div className="flex gap-sm">
                    <button onClick={() => handleSave(session._id)} className="btn btn-primary" style={{ flex: 1, padding: '6px' }}>Save</button>
                    <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ flex: 1, padding: '6px' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between" style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Time Played</span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{session.hoursPlayed} <span style={{ fontSize: '0.9rem' }}>hrs</span></strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Last Played</span>
                      <strong>{new Date(session.lastPlayed).toLocaleDateString()}</strong>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                    <button onClick={() => handleEditClick(session)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                      Update Progress
                    </button>
                    <button onClick={() => handleRemove(session._id)} style={{ color: 'var(--danger)', background: 'none', fontSize: '0.85rem' }}>
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
