import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import QueryPage from './pages/QueryPage';
import DatabasesPage from './pages/DatabasesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Box className="app-container">
      <Header />
      
      <Box component="main" className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/databases" element={<DatabasesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
      
      <Footer />
    </Box>
  );
}

export default App; 