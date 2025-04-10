import React, { useContext, useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Spacer,
  useTheme, // Import useTheme to access theme values
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext.jsx'; // Corrected relative path

/**
 * Navbar component displays the application title and user authentication status.
 * It provides a logout button for authenticated users.
 */
const Navbar = () => {
  const { currentUser, logout } = useAuth(); // Consume the AuthContext
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Local loading state for logout action
  const theme = useTheme(); // Access the theme object

  /**
   * Handles the logout button click event.
   * Sets loading state, calls the logout function from context,
   * and resets loading state upon completion or error.
   */
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true); // Indicate logout process started
    try {
      await logout();
      // Logout successful - currentUser will become null via AuthContext's onAuthStateChanged
    } catch (error) {
      // Log error for debugging. User-facing errors might be handled globally or in AuthContext.
      console.error('Logout failed in Navbar:', error);
    } finally {
      // Ensure loading state is reset regardless of success or failure
      setIsLoggingOut(false);
    }
  }, [logout]); // Dependency array includes the stable logout function from context

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={{ base: '1rem', md: '1.5rem' }} // Responsive padding
      bg="gray.100" // Background color, can be adjusted based on theme
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      {/* Application Branding/Title */}
      <Heading
        as="h1"
        size="lg"
        letterSpacing={'-.1rem'}
        fontFamily={theme.fonts?.heading || 'serif'} // Use theme heading font, fallback to serif
        color={theme.colors?.brand?.[500] || 'pink.500'} // Use theme brand color, fallback
      >
        Sweet Surprises
      </Heading>

      <Spacer /> {/* Pushes user info/logout to the right */}

      {/* User Information and Logout Button - Render only if user is logged in */}
      {currentUser && (
        <Flex align="center">
          {/* Defensive check for currentUser and email before rendering */}
          {currentUser.email && (
            <Text fontSize="sm" mr={4} display={{ base: 'none', md: 'block' }}> {/* Hide email on smaller screens */}
              {currentUser.email}
            </Text>
          )}
          <Button
            colorScheme="pink" // Consistent branding
            variant="outline"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoggingOut} // Disable button and show spinner while logging out
            loadingText="Logging out"
          >
            Logout
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;