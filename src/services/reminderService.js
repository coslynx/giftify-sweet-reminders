import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  where, // Keep 'where' import if needed for future filtering, though not used in base getReminders
} from 'firebase/firestore';
import { db } from '../config/firebase.js'; // Import the initialized Firestore instance

/**
 * @typedef {import("firebase/firestore").DocumentReference} FirestoreDocumentReference
 * @typedef {import("firebase/firestore").CollectionReference} FirestoreCollectionReference
 * @typedef {import("firebase/firestore").Query} FirestoreQuery
 * @typedef {import("firebase/firestore").QuerySnapshot} FirestoreQuerySnapshot
 * @typedef {import("firebase/firestore").DocumentData} FirestoreDocumentData
 * @typedef {import("firebase/firestore").FirestoreError} FirestoreError
 */

/**
 * Represents a reminder object returned from the service.
 * @typedef {object} Reminder
 * @property {string} id - The unique identifier of the reminder document.
 * @property {string} text - The content text of the reminder.
 * @property {Date} date - The target date and time for the reminder as a JavaScript Date object.
 */

// Helper function to validate non-empty string arguments
const validateNonEmptyString = (value, argName) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${argName} must be a non-empty string.`);
  }
};

/**
 * Adds a new reminder document to the Firestore database for a specific user.
 *
 * @param {string} userId - The ID of the user for whom to add the reminder. Must be a non-empty string.
 * @param {{ text: string, date: Date }} reminderData - An object containing the reminder details.
 *   - `text`: The reminder content (must be a non-empty string).
 *   - `date`: The target date/time for the reminder (must be a valid JavaScript Date object).
 * @returns {Promise<FirestoreDocumentReference>} A promise that resolves with the DocumentReference of the newly created reminder.
 * @throws {TypeError} If `userId` is not a non-empty string, or if `reminderData` or its properties (`text`, `date`) are invalid.
 * @throws {FirestoreError} Propagates Firestore errors during the add operation.
 */
export const addReminder = async (userId, reminderData) => {
  try {
    validateNonEmptyString(userId, 'userId');

    if (!reminderData || typeof reminderData !== 'object') {
      throw new TypeError('reminderData must be an object.');
    }
    validateNonEmptyString(reminderData.text, 'reminderData.text');
    if (!(reminderData.date instanceof Date) || isNaN(reminderData.date.getTime())) {
      throw new TypeError('reminderData.date must be a valid Date object.');
    }

    // Convert JavaScript Date to Firestore Timestamp
    const reminderPayload = {
      text: reminderData.text,
      date: Timestamp.fromDate(reminderData.date),
      // Avoid storing userId in the document itself if path provides scoping
      // Add createdAt timestamp if needed: createdAt: Timestamp.now()
    };

    const remindersColRef = collection(db, 'users', userId, 'reminders');
    const docRef = await addDoc(remindersColRef, reminderPayload);
    return docRef;
  } catch (error) {
    // Log validation errors specifically, but let others propagate
    if (error instanceof TypeError) {
      console.error("Validation Error in addReminder:", error.message);
    }
    // Rethrow to allow upstream handling (e.g., in UI)
    throw error;
  }
};

/**
 * Retrieves all reminders for a specific user from Firestore, ordered by date ascending.
 *
 * @param {string} userId - The ID of the user whose reminders to fetch. Must be a non-empty string.
 * @returns {Promise<Array<Reminder>>} A promise that resolves with an array of reminder objects.
 *   Each object includes `id`, `text`, and `date` (as a JavaScript Date). Returns an empty array if no reminders are found.
 * @throws {TypeError} If `userId` is not a non-empty string.
 * @throws {FirestoreError} Propagates Firestore errors during the query execution.
 */
export const getReminders = async (userId) => {
  try {
    validateNonEmptyString(userId, 'userId');

    const remindersColRef = collection(db, 'users', userId, 'reminders');
    const q = query(remindersColRef, orderBy('date', 'asc')); // Order by date ascending

    const querySnapshot = await getDocs(q);

    const reminders = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Validate data structure slightly - ensure date exists and is a Timestamp
      if (data.text && data.date && data.date instanceof Timestamp) {
        reminders.push({
          id: docSnap.id,
          text: data.text,
          date: data.date.toDate(), // Convert Firestore Timestamp back to JS Date
        });
      } else {
        // Log a warning if a document has unexpected structure
        console.warn(`Reminder document ${docSnap.id} for user ${userId} has invalid structure or missing fields.`);
      }
    });

    return reminders;
  } catch (error) {
    // Log validation errors specifically, but let others propagate
    if (error instanceof TypeError) {
      console.error("Validation Error in getReminders:", error.message);
    }
    // Rethrow to allow upstream handling
    throw error;
  }
};

/**
 * Updates an existing reminder document in Firestore for a specific user.
 * Only the fields provided in `updatedData` will be updated.
 *
 * @param {string} userId - The ID of the user who owns the reminder. Must be a non-empty string.
 * @param {string} reminderId - The ID of the reminder document to update. Must be a non-empty string.
 * @param {{ text?: string, date?: Date }} updatedData - An object containing the fields to update.
 *   Must contain at least one valid key (`text` or `date`).
 *   - `text`: Optional new reminder content (if provided, must be a non-empty string).
 *   - `date`: Optional new target date/time (if provided, must be a valid JavaScript Date object).
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {TypeError} If `userId`, `reminderId`, or `updatedData` are invalid, or if `updatedData` is empty or contains invalid property values.
 * @throws {FirestoreError} Propagates Firestore errors (e.g., document not found, permission denied).
 */
export const updateReminder = async (userId, reminderId, updatedData) => {
  try {
    validateNonEmptyString(userId, 'userId');
    validateNonEmptyString(reminderId, 'reminderId');

    if (!updatedData || typeof updatedData !== 'object' || Object.keys(updatedData).length === 0) {
      throw new TypeError('updatedData must be a non-empty object with fields to update.');
    }

    const dataToUpdate = {};

    // Validate and prepare 'text' field if present
    if (updatedData.hasOwnProperty('text')) {
      if (typeof updatedData.text !== 'string' || updatedData.text.trim() === '') {
        throw new TypeError('updatedData.text, if provided, must be a non-empty string.');
      }
      dataToUpdate.text = updatedData.text;
    }

    // Validate and prepare 'date' field if present
    if (updatedData.hasOwnProperty('date')) {
      if (!(updatedData.date instanceof Date) || isNaN(updatedData.date.getTime())) {
        throw new TypeError('updatedData.date, if provided, must be a valid Date object.');
      }
      // Convert valid JS Date to Firestore Timestamp for update
      dataToUpdate.date = Timestamp.fromDate(updatedData.date);
    }

    // Check if, after validation, there's actually anything to update
    if (Object.keys(dataToUpdate).length === 0) {
        throw new TypeError('updatedData object did not contain any valid fields to update (text or date).');
    }


    const reminderDocRef = doc(db, 'users', userId, 'reminders', reminderId);
    await updateDoc(reminderDocRef, dataToUpdate);

  } catch (error) {
    // Log validation errors specifically, but let others propagate
    if (error instanceof TypeError) {
      console.error("Validation Error in updateReminder:", error.message);
    }
    // Rethrow to allow upstream handling
    throw error;
  }
};

/**
 * Deletes a specific reminder document from Firestore for a given user.
 *
 * @param {string} userId - The ID of the user who owns the reminder. Must be a non-empty string.
 * @param {string} reminderId - The ID of the reminder document to delete. Must be a non-empty string.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 * @throws {TypeError} If `userId` or `reminderId` are not non-empty strings.
 * @throws {FirestoreError} Propagates Firestore errors during the delete operation.
 */
export const deleteReminder = async (userId, reminderId) => {
  try {
    validateNonEmptyString(userId, 'userId');
    validateNonEmptyString(reminderId, 'reminderId');

    const reminderDocRef = doc(db, 'users', userId, 'reminders', reminderId);
    await deleteDoc(reminderDocRef);

  } catch (error) {
    // Log validation errors specifically, but let others propagate
    if (error instanceof TypeError) {
      console.error("Validation Error in deleteReminder:", error.message);
    }
    // Rethrow to allow upstream handling
    throw error;
  }
};