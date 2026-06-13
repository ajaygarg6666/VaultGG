import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GameDetail from './pages/GameDetail';
import MyLibrary from './pages/MyLibrary';
import StatsDashboard from './pages/StatsDashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="page-layout">
          <Navbar />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#20242d',
                color: '#f0f2f5',
                border: '1px solid #2d3340',
              },
            }}
          />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/stats" element={<StatsDashboard />} />
              <Route path="/library" element={
                <ProtectedRoute>
                  <MyLibrary />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
