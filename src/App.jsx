import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Center } from '@chakra-ui/react'; // Added Center for loading spinner positioning

import { useAuth } from '../contexts/AuthContext.jsx'; // Corrected import
import LoginPage from './pages/LoginPage.jsx'; // Corrected import
import DashboardPage from './pages/DashboardPage.jsx'; // Corrected import
import Navbar from './components/Navbar.jsx'; // Corrected import
import LoadingSpinner from './components/LoadingSpinner.jsx'; // Corrected import

/**
 * The main application component that handles routing and layout based on authentication state.
 * It displays a loading indicator during the initial authentication check,
 * directs users to the login page if unauthenticated, and renders the dashboard
 * with a navigation bar for authenticated users.
 *
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  // Consume authentication context to get user state and loading status
  const { currentUser, loading } = useAuth();

  // Display a loading spinner during the initial authentication check
  if (loading) {
    return (
      <Center minHeight="100vh"> {/* Use Center for easy centering */}
        <LoadingSpinner size="xl" />
      </Center>
    );
  }

  // Once loading is complete, define application routes
  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={
          // If user is already logged in, redirect to dashboard
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Dashboard Route (Protected) */}
      <Route
        path="/"
        element={
          // If user is logged in, render the authenticated layout
          currentUser ? (
            <Box>
              <Navbar />
              <DashboardPage />
            </Box>
          ) : (
            // If user is not logged in, redirect to login page
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch-all Route (Optional but Recommended) */}
      {/* Redirects any unmatched paths to the login page if not logged in,
          or the dashboard if logged in. */}
      <Route
        path="*"
        element={
          currentUser ? (
            <Navigate to="/" replace /> // Redirect logged-in users to dashboard
          ) : (
            <Navigate to="/login" replace /> // Redirect logged-out users to login
          )
        }
      />
    </Routes>
  );
};

export default App;