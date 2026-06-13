import React, { useState, useEffect } from 'react';
import { gamesAPI } from '../api';
import GameCard from '../components/GameCard';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedGenre) params.genre = selectedGenre;
      
      const res = await gamesAPI.getAll(params);
      setGames(res.data.data);
    } catch (error) {
      console.error('Failed to fetch games', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await gamesAPI.getGenres();
      setGenres(res.data.data);
    } catch (error) {
      console.error('Failed to fetch genres', error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchGames();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedGenre]);

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* IMDb Section Header */}
      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'inline-block', width: '4px', height: '32px', backgroundColor: 'var(--accent-color)', borderRadius: '2px' }}></span>
          {search || selectedGenre ? "Search Results" : "Top Games"}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '10px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0, fontWeight: '600' }}>
            {search || selectedGenre ? 'Showing matching games for your criteria' : 'Explore our highest-rated recommendations'}
          </p>
        </div>
      </div>

      <div className="flex items-center" style={{ flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
        <div className="search-container flex-1" style={{ maxWidth: '400px' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search titles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: '4px', padding: '10px 15px', backgroundColor: '#fff', color: '#000', border: 'none', fontWeight: '500' }}
          />
        </div>
        
        <div style={{ minWidth: '180px' }}>
          <select 
            className="form-control" 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{ borderRadius: '4px', padding: '10px 15px', backgroundColor: 'var(--bg-card)', color: '#fff', border: '1px solid var(--border-color)', fontWeight: '500' }}
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading games...</div>
      ) : games.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>No games found matching your criteria.</h3>
        </div>
      ) : (
        <div className="game-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {(!search && !selectedGenre ? games.slice(0, 12) : games).map(game => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
