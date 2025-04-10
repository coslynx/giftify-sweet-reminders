import React, { useState, useCallback } from 'react';
import {
  Box,
  VStack,
  Center,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext.jsx';
// LoadingSpinner is available but loading feedback is primarily via the Button state
// import LoadingSpinner from '../components/LoadingSpinner.jsx';

/**
 * LoginPage Component
 *
 * Provides the user interface for logging into the application.
 * It includes form fields for email and password, handles form submission,
 * displays validation errors, and shows loading/error states from the AuthContext.
 */
const LoginPage = () => {
  // Local state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Local state for client-side validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Consume authentication context
  const { login, loading, error: authError } = useAuth(); // Renamed context error to avoid naming clash

  /**
   * Handles form submission.
   * Performs client-side validation and calls the login function from AuthContext.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault(); // Prevent default browser form submission

      // Reset client-side validation errors before new validation
      setEmailError('');
      setPasswordError('');

      // Client-Side Validation
      let isValid = true;
      if (!email.trim()) {
        setEmailError('Email is required.');
        isValid = false;
      }
      // Basic email format check (optional, Firebase handles it too)
      // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      //   setEmailError('Please enter a valid email address.');
      //   isValid = false;
      // }

      if (!password.trim()) {
        setPasswordError('Password is required.');
        isValid = false;
      }

      // If client-side validation fails, stop submission
      if (!isValid) {
        return;
      }

      // If validation passes, attempt login via context
      // The `login` function within AuthContext handles setting its own loading/error states
      try {
        await login(email, password);
        // Navigation on successful login should be handled by App.jsx
        // observing the currentUser state change in AuthContext.
      } catch (err) {
         // Although AuthContext sets its error state, logging here might be useful for debugging
         // if AuthContext doesn't rethrow or if more specific handling is needed here.
         // Typically, relying on AuthContext's error state is sufficient.
         console.error("Login attempt failed in LoginPage handler:", err);
      }
    },
    [email, password, login] // Dependencies for useCallback
  );

  return (
    <Center minH="100vh" bg="gray.50">
      <Box
        p={{ base: 6, md: 8 }}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
        bg="white"
        w={{ base: '90%', sm: '400px' }} // Responsive width
      >
        <VStack spacing={6} as="form" onSubmit={handleSubmit} noValidate>
          <Heading as="h1" size="lg" textAlign="center">
            Login
          </Heading>

          {/* Display Authentication Error from Context */}
          {authError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {authError}
            </Alert>
          )}

          {/* Email Input Field */}
          <FormControl isInvalid={!!emailError} isRequired>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              isDisabled={loading} // Disable input while context is loading
            />
            {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
          </FormControl>

          {/* Password Input Field */}
          <FormControl isInvalid={!!passwordError} isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              isDisabled={loading} // Disable input while context is loading
            />
            {passwordError && (
              <FormErrorMessage>{passwordError}</FormErrorMessage>
            )}
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="pink" // Match potential theme brand color
            width="full"
            isLoading={loading} // Show loading state from context
            isDisabled={loading} // Disable button explicitly when loading
            loadingText="Logging in..."
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginPage;