import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('vaultgg_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Games
export const gamesAPI = {
  getAll: (params) => API.get('/games', { params }),
  getById: (id) => API.get(`/games/${id}`),
  create: (data) => API.post('/games', data),
  update: (id, data) => API.put(`/games/${id}`, data),
  delete: (id) => API.delete(`/games/${id}`),
  getGenres: () => API.get('/games/genres/list'),
};

// Reviews
export const reviewsAPI = {
  getByGame: (gameId) => API.get(`/reviews/game/${gameId}`),
  getMyReviews: () => API.get('/reviews/user/my'),
  create: (data) => API.post('/reviews', data),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
  vote: (id, helpful) => API.post(`/reviews/${id}/vote`, { helpful }),
};

// Sessions
export const sessionsAPI = {
  getLibrary: () => API.get('/sessions/library'),
  addToLibrary: (data) => API.post('/sessions', data),
  updateSession: (id, data) => API.put(`/sessions/${id}`, data),
  removeFromLibrary: (id) => API.delete(`/sessions/${id}`),
  checkGame: (gameId) => API.get(`/sessions/check/${gameId}`),
};

// Stats
export const statsAPI = {
  getTopGames: () => API.get('/stats/top-games'),
  getPlaytime: () => API.get('/stats/playtime'),
  getGenreRatings: () => API.get('/stats/genre-ratings'),
  getCompletion: () => API.get('/stats/completion'),
  getMonthlyActive: () => API.get('/stats/monthly-active'),
  getOverview: () => API.get('/stats/overview'),
};

export default API;
