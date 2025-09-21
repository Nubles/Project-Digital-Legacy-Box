import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CreateBoxPage from './pages/CreateBoxPage';
import BoxDetailPage from './pages/BoxDetailPage'; // Import the new page
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div>
      <NavBar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-box"
            element={
              <ProtectedRoute>
                <CreateBoxPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/box/:id"
            element={
              <ProtectedRoute>
                <BoxDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
