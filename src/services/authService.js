// src/services/authService.js
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

/**
 * @typedef {import("firebase/auth").Auth} FirebaseAuth
 * @typedef {import("firebase/auth").UserCredential} FirebaseUserCredential
 */

/**
 * Attempts to sign in a user with the provided email and password using Firebase Authentication.
 * This function acts as a lightweight wrapper around the Firebase SDK's `signInWithEmailAndPassword`.
 * It performs basic input validation before calling the Firebase SDK function.
 * Errors from Firebase (e.g., invalid credentials, network issues) are allowed to propagate
 * up to the caller (typically the AuthContext) for centralized handling and mapping.
 *
 * @param {FirebaseAuth} authInstance - The initialized Firebase Auth instance.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<FirebaseUserCredential>} A promise that resolves with the UserCredential upon successful authentication.
 * @throws {TypeError} If email or password are not non-empty strings.
 * @throws {FirebaseAuthError} Propagates Firebase authentication errors (e.g., auth/invalid-credential).
 */
export const loginUser = async (authInstance, email, password) => {
  // Basic Input Validation
  if (typeof email !== 'string' || email.trim() === '') {
    throw new TypeError('Email must be a non-empty string.');
  }
  if (typeof password !== 'string' || password.trim() === '') {
    throw new TypeError('Password must be a non-empty string.');
  }

  // Call Firebase SDK function and return the promise directly.
  // Errors will propagate to the caller (AuthContext).
  return signInWithEmailAndPassword(authInstance, email, password);
};

/**
 * Signs out the currently authenticated user using Firebase Authentication.
 * This function is a lightweight wrapper around the Firebase SDK's `signOut` function.
 * Errors during the sign-out process are allowed to propagate up to the caller
 * (typically the AuthContext) for centralized handling.
 *
 * @param {FirebaseAuth} authInstance - The initialized Firebase Auth instance.
 * @returns {Promise<void>} A promise that resolves when the sign-out process is complete.
 * @throws {FirebaseAuthError} Propagates Firebase sign-out errors.
 */
export const logoutUser = async (authInstance) => {
  // Call Firebase SDK function and return the promise directly.
  // Errors will propagate to the caller (AuthContext).
  return signOut(authInstance);
};