import React, { useState, useEffect } from 'react';
import { statsAPI } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#7b2cbf', '#9d4edd', '#c77dff', '#e0b1cb', '#240046'];

const StatsDashboard = () => {
  const [topGames, setTopGames] = useState([]);
  const [genreRatings, setGenreRatings] = useState([]);
  const [playtime, setPlaytime] = useState([]);
  const [completion, setCompletion] = useState({ completed: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [topRes, genreRes, playRes, compRes] = await Promise.all([
          statsAPI.getTopGames(),
          statsAPI.getGenreRatings(),
          statsAPI.getPlaytime(),
          statsAPI.getCompletion()
        ]);
        
        setTopGames(topRes.data.data);
        setGenreRatings(genreRes.data.data);
        setPlaytime(playRes.data.data);
        
        if (compRes.data.data && compRes.data.data.length > 0) {
          let compCount = 0;
          let inProgCount = 0;
          compRes.data.data.forEach(item => {
            if (item.status === 'Completed') compCount = item.count;
            if (item.status === 'In Progress') inProgCount = item.count;
          });
          setCompletion({
            completed: compCount,
            inProgress: inProgCount
          });
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading Statistics...</div>;

  const pieData = [
    { name: 'Completed', value: completion.completed },
    { name: 'In Progress', value: completion.inProgress }
  ];

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <h1 style={{ margin: '40px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Platform Statistics</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        <div className="stat-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', textTransform: 'uppercase' }}>Most Played User Hours</h3>
          {playtime.length > 0 ? (
            <>
              <div className="stat-value">{playtime[0].totalHours}</div>
              <p>User: <strong>{playtime[0].username || 'Unknown'}</strong></p>
            </>
          ) : <p>No data</p>}
        </div>
        
        <div className="stat-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', textTransform: 'uppercase' }}>Highest Rated Game</h3>
          {topGames.length > 0 ? (
            <>
              <div className="stat-value" style={{ fontSize: '1.8rem', marginTop: '15px' }}>{topGames[0].title}</div>
              <p>Rating: <strong>{topGames[0].averageRating.toFixed(1)} / 5</strong></p>
            </>
          ) : <p>No data</p>}
        </div>
        
        <div className="stat-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', textTransform: 'uppercase' }}>Overall Completion</h3>
          <div className="flex gap-md" style={{ marginTop: '15px' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{completion.completed}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>COMPLETED</span>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', margin: '0 10px' }}></div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{completion.inProgress}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>IN PROGRESS</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px' }}>
        
        {/* Top Games Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '20px' }}>Top 5 Highest Rated Games</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={topGames} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3340" />
                <XAxis type="number" domain={[0, 5]} stroke="#a0a6b5" />
                <YAxis dataKey="title" type="category" width={150} stroke="#a0a6b5" tick={{ fill: '#a0a6b5', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#2a2f3a' }} contentStyle={{ backgroundColor: '#20242d', border: '1px solid #2d3340', color: '#f0f2f5' }} />
                <Bar dataKey="averageRating" fill="var(--accent-color)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Ratings */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '20px' }}>Average Rating by Genre</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={genreRatings} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3340" />
                <XAxis dataKey="_id" stroke="#a0a6b5" tick={{ fill: '#a0a6b5', fontSize: 12 }} />
                <YAxis domain={[0, 5]} stroke="#a0a6b5" />
                <Tooltip cursor={{ fill: '#2a2f3a' }} contentStyle={{ backgroundColor: '#20242d', border: '1px solid #2d3340', color: '#f0f2f5' }} />
                <Bar dataKey="averageRating" fill="#c77dff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsDashboard;
