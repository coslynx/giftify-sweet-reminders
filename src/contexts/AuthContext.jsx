import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.js'; // Import initialized auth instance
// Anticipate authService functions - ensure this file exists later
import { loginUser, logoutUser } from '../services/authService.js';

/**
 * @typedef {import("firebase/auth").User} FirebaseUser
 * @typedef {import("firebase/auth").AuthError} FirebaseAuthError
 */

/**
 * Context object for authentication state.
 * @type {React.Context<AuthContextType | undefined>}
 */
const AuthContext = createContext(undefined);

/**
 * @typedef {object} AuthContextType
 * @property {FirebaseUser | null} currentUser - The currently authenticated Firebase user object, or null if not authenticated.
 * @property {boolean} loading - Indicates if authentication state is being checked or a login/logout operation is in progress.
 * @property {string | null} error - Stores user-friendly authentication error messages.
 * @property {(email: string, password: string) => Promise<void>} login - Function to log the user in.
 * @property {() => Promise<void>} logout - Function to log the user out.
 */

/**
 * Maps Firebase Authentication error codes to user-friendly messages.
 * @param {FirebaseAuthError | Error} error - The error object from Firebase or a generic error.
 * @returns {string} A user-friendly error message.
 */
const mapAuthErrorToMessage = (error) => {
  if (error && typeof error === 'object' && 'code' in error) {
    // It's likely a FirebaseAuthError
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found': // Grouping these for security - don't reveal if user exists
      case 'auth/wrong-password':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/too-many-requests':
        return 'Access temporarily disabled due to too many failed login attempts. Please reset your password or try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/email-already-in-use': // Although not used in login, good to have
        return 'This email address is already associated with an account.';
      case 'auth/weak-password': // Although not used in login, good to have
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Invalid email format. Please enter a valid email address.';
      default:
        console.error('Unhandled Firebase Auth Error:', error);
        return 'An unexpected authentication error occurred. Please try again later.';
    }
  } else {
    // Generic error
    console.error('Generic Auth Error:', error);
    return 'An unexpected error occurred. Please try again.';
  }
};


/**
 * Provides authentication state and actions to its children components.
 * Manages the current user, loading status, and errors related to authentication.
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components that need access to the auth context.
 * @returns {JSX.Element} The provider component wrapping the children.
 */
export const AuthProvider = ({ children }) => {
  /** @type {[FirebaseUser | null, React.Dispatch<React.SetStateAction<FirebaseUser | null>>]} */
  const [currentUser, setCurrentUser] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(true); // Start loading until initial check completes
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    try {
      // Subscribe to Firebase auth state changes
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user); // Update currentUser state
          setLoading(false); // Initial auth check complete
          setError(null); // Clear any previous errors on state change
        },
        (authError) => {
          // Handle errors during the subscription itself (rare)
          console.error('Error subscribing to auth state changes:', authError);
          setError('Failed to monitor authentication status.');
          setCurrentUser(null); // Ensure user is null if error occurs
          setLoading(false);
        }
      );
    } catch (initializationError) {
        console.error('Error setting up onAuthStateChanged listener:', initializationError);
        setError('Failed to initialize authentication monitoring.');
        setCurrentUser(null);
        setLoading(false);
    }

    // Cleanup function: Unsubscribe when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Logs in a user with email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<void>} A promise that resolves on successful login attempt initiation (actual user state update handled by onAuthStateChanged).
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Delegate login logic to authService
      await loginUser(auth, email, password);
      // Successful login attempt initiated.
      // onAuthStateChanged will handle setting currentUser.
      // We don't need to explicitly set currentUser here.
      // Set loading to false here for quicker feedback, though onAuthStateChanged will also set it.
      setLoading(false);
    } catch (err) {
      const friendlyError = mapAuthErrorToMessage(err);
      setError(friendlyError);
      setLoading(false); // Ensure loading is false on error
      // Rethrow or handle as needed, but setting state is primary role here
      // console.error("Login failed:", err); // Original error logged by mapAuthErrorToMessage if needed
    }
  }, []); // Depends only on auth instance, which is stable

  /**
   * Logs out the current user.
   * @returns {Promise<void>} A promise that resolves on successful logout attempt initiation (actual user state update handled by onAuthStateChanged).
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Delegate logout logic to authService
      await logoutUser(auth);
      // Successful logout attempt initiated.
      // onAuthStateChanged will set currentUser to null.
      // Set loading false for quicker feedback.
      setLoading(false);
    } catch (err) {
      console.error("Logout failed:", err); // Log original error
      setError("Logout failed. Please try again."); // Set user-friendly error
      setLoading(false); // Ensure loading is false on error
    }
  }, []); // Depends only on auth instance, which is stable

  // Memoize the context value to prevent unnecessary re-renders
  // Ensure login and logout functions passed are the memoized versions
  const value = useMemo(
    () => ({
      currentUser,
      loading,
      error,
      login, // Use the memoized login function
      logout, // Use the memoized logout function
    }),
    [currentUser, loading, error, login, logout] // Include memoized functions in dependency array
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to consume the AuthContext.
 * Provides easy access to the authentication state and actions.
 * Throws an error if used outside of an AuthProvider.
 * @returns {AuthContextType} The authentication context value.
 * @throws {Error} If the hook is used outside an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};