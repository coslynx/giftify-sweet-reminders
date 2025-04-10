import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  FormErrorMessage,
  HStack,
  Button,
  useTheme,
} from '@chakra-ui/react';

/**
 * Helper function to format a JavaScript Date object into 'YYYY-MM-DD' string.
 * Returns an empty string if the input is not a valid Date.
 * @param {Date | null | undefined} dateObject - The Date object to format.
 * @returns {string} The date formatted as 'YYYY-MM-DD' or an empty string.
 */
const formatDateToYYYYMMDD = (dateObject) => {
  if (!(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
    return '';
  }
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = dateObject.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Renders a form for creating or editing reminders.
 * Handles text and date input, validation, and submission delegation.
 */
const ReminderForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isSubmitting = false,
}) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState(''); // Store date as 'YYYY-MM-DD' string
  const [errors, setErrors] = useState({});
  const theme = useTheme();

  // Effect to populate form when initialData changes (for editing) or reset when null
  useEffect(() => {
    setErrors({}); // Clear errors when initialData changes
    if (initialData) {
      setText(initialData.text || '');

      // Robustly parse initialData.date
      let parsedDateObject = null;
      if (initialData.date instanceof Date) {
        parsedDateObject = initialData.date;
      } else if (initialData.date && typeof initialData.date.toDate === 'function') {
        // Firestore Timestamp-like object
        try {
            parsedDateObject = initialData.date.toDate();
        } catch (e) {
            console.error("Error converting Firestore Timestamp to Date:", e);
        }
      } else if (typeof initialData.date === 'string') {
        // Attempt to parse string (ISO format preferred)
        const parsed = new Date(initialData.date);
        if (!isNaN(parsed.getTime())) {
          parsedDateObject = parsed;
        } else {
             // Handle potential non-ISO strings if necessary, or log warning
             console.warn(`Could not parse date string from initialData: ${initialData.date}`);
        }
      }

      // Format the parsed date object to 'YYYY-MM-DD'
      const formattedDate = formatDateToYYYYMMDD(parsedDateObject);
      setDate(formattedDate);
      if (!formattedDate && initialData.date) {
          // If formatting failed but there was initial date data, maybe set an error
          console.warn("Failed to format initial date:", initialData.date);
          // Optionally set an error: setErrors(prev => ({ ...prev, date: 'Invalid initial date format.' }));
      }

    } else {
      // Reset form if initialData is null (create mode)
      setText('');
      setDate('');
    }
  }, [initialData]); // Rerun effect if initialData prop changes

  /**
   * Validates the current form state (text and date).
   * Updates the errors state object.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validate = () => {
    const newErrors = {};
    if (!text.trim()) {
      newErrors.text = 'Reminder text cannot be empty.';
    }
    if (!date) {
      newErrors.date = 'Please select a date.';
    } else {
      // Basic check if date string matches YYYY-MM-DD format (Input type="date" helps)
      // More complex validation (e.g., ensuring it's not a past date) could go here
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
          newErrors.date = 'Invalid date format selected.';
      }
      // Optional: Prevent past dates (uncomment if needed)
      // const today = new Date();
      // today.setHours(0, 0, 0, 0); // Set to midnight
      // const selectedDate = new Date(date + 'T00:00:00'); // Ensure correct timezone comparison
      // if (selectedDate < today) {
      //   newErrors.date = 'Selected date cannot be in the past.';
      // }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  /**
   * Handles the form submission process.
   * Prevents default submission, validates input, and calls the onSubmit prop if valid.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors before new validation

    if (validate()) {
      // Call the parent component's onSubmit function with the form data
      onSubmit({ text: text.trim(), date });
    }
    // If validation fails, the errors state is already updated by validate()
  };

  // Get today's date in 'YYYY-MM-DD' format for the min attribute
  const todayString = formatDateToYYYYMMDD(new Date());

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4} align="stretch">
        {/* Reminder Text Input */}
        <FormControl isInvalid={!!errors.text} isRequired>
          <FormLabel htmlFor="reminder-text">Reminder Text</FormLabel>
          <Textarea
            id="reminder-text"
            placeholder="What sweet surprise are you planning?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            isDisabled={isSubmitting} // Disable while parent is submitting
            fontFamily={theme.fonts.body || 'sans-serif'}
            focusBorderColor={theme.colors.brand?.[500] || 'pink.500'}
            size="md"
            resize="vertical" // Allow vertical resizing
          />
          {errors.text && <FormErrorMessage>{errors.text}</FormErrorMessage>}
        </FormControl>

        {/* Reminder Date Input */}
        <FormControl isInvalid={!!errors.date} isRequired>
          <FormLabel htmlFor="reminder-date">Target Date</FormLabel>
          <Input
            id="reminder-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            isDisabled={isSubmitting} // Disable while parent is submitting
            min={todayString} // Prevent selecting past dates (optional)
            fontFamily={theme.fonts.body || 'sans-serif'}
            focusBorderColor={theme.colors.brand?.[500] || 'pink.500'}
            size="md"
          />
          {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
        </FormControl>

        {/* Action Buttons */}
        <HStack spacing={3} justifyContent="flex-end" mt={2}>
          <Button
            variant="ghost"
            onClick={onCancel}
            isDisabled={isSubmitting} // Disable while submitting
            type="button" // Ensure it doesn't trigger form submission
          >
            Cancel
          </Button>
          <Button
            type="submit" // Triggers the form's onSubmit handler
            bg={theme.colors.brand?.[500] || 'pink.500'}
            color="white"
            _hover={{ bg: theme.colors.brand?.[600] || 'pink.600' }}
            isLoading={isSubmitting}
            loadingText="Saving..."
            isDisabled={isSubmitting} // Explicitly disable when loading
          >
            Save Reminder
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

// Define PropTypes for type checking and documentation
ReminderForm.propTypes = {
  /**
   * Asynchronous function called when the form is submitted and validated.
   * Receives an object `{ text: string, date: string }` where date is 'YYYY-MM-DD'.
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Function called when the 'Cancel' button is clicked.
   */
  onCancel: PropTypes.func.isRequired,
  /**
   * Optional object containing existing reminder data (`id`, `text`, `date`)
   * to pre-populate the form for editing. `date` can be JS Date, Firestore Timestamp-like, or string.
   */
  initialData: PropTypes.shape({
    id: PropTypes.string, // ID is usually present when editing, but not strictly required by the form itself
    text: PropTypes.string,
    date: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.shape({ toDate: PropTypes.func }), // Duck-typing for Firestore Timestamp
      PropTypes.string, // ISO String primarily
    ]),
  }),
  /**
   * Boolean indicating if the parent component is currently processing the submission.
   * Used to display loading state on the submit button. Defaults to false.
   */
  isSubmitting: PropTypes.bool,
};

// Set default props
ReminderForm.defaultProps = {
  initialData: null,
  isSubmitting: false,
};

export default ReminderForm;