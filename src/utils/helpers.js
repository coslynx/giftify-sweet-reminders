/**
 * Represents a Firestore Timestamp object (duck-typed).
 * @typedef {{toDate: () => Date}} Timestamp
 */

/**
 * Formats a given date input (JavaScript Date, Firestore Timestamp, null, or undefined)
 * into a 'YYYY-MM-DD' string. Returns an empty string ('') for invalid inputs or if
 * the input cannot be resolved to a valid date.
 *
 * @param {Date | Timestamp | null | undefined} dateInput - The date value to format. Can be a JS Date,
 *   an object with a `toDate` method (like Firestore Timestamp), null, or undefined.
 * @returns {string} The formatted date string ('YYYY-MM-DD') or an empty string ('') if the input is invalid.
 */
export function formatDateForDisplay(dateInput) {
  // 1. Handle null or undefined input
  if (dateInput == null) {
    return '';
  }

  let dateObject = null;

  // 2. Handle Firestore Timestamp-like objects
  if (typeof dateInput.toDate === 'function') {
    try {
      dateObject = dateInput.toDate();
      // Ensure the result of toDate() is actually a Date object
      if (!(dateObject instanceof Date)) {
         console.warn('formatDateForDisplay: input.toDate() did not return a Date object.');
         return '';
      }
    } catch (error) {
      console.error('formatDateForDisplay: Error calling toDate() on input:', error);
      return ''; // Failed to convert timestamp
    }
  }
  // 3. Handle if input is already a JavaScript Date object
  else if (dateInput instanceof Date) {
    dateObject = dateInput;
  }
  // 4. Handle any other invalid input types
  else {
    // Input is not null/undefined, not a Timestamp-like, and not a Date
    console.warn('formatDateForDisplay: Received invalid input type.');
    return '';
  }

  // 5. Validate the resolved Date object
  // Check if dateObject is a valid Date instance and represents a valid time
  if (!(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
     console.warn('formatDateForDisplay: Input resolved to an invalid Date object.');
    return '';
  }

  // 6. Format the valid Date object to 'YYYY-MM-DD'
  try {
    const year = dateObject.getFullYear();
    // getMonth() is 0-indexed (0-11), so add 1
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (formatError) {
      // Catch potential errors during date part extraction (highly unlikely for valid dates)
      console.error('formatDateForDisplay: Unexpected error during date formatting:', formatError);
      return '';
  }
}