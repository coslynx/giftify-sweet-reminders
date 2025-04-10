import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Flex,
  Text,
  HStack,
  Spacer,
  IconButton,
  useTheme,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
// Assuming formatDate exists and works as specified in ../utils/helpers.js
// It should accept a Date object and return a formatted string.
import { formatDate } from '../utils/helpers.js';

/**
 * Displays a single reminder item with its text, formatted date, and action buttons (Edit, Delete).
 * Intended to be rendered within ReminderList.
 *
 * @param {object} props - The component props.
 * @param {object} props.reminder - The reminder object containing id, text, and date.
 * @param {function} props.onEdit - Callback function when the Edit button is clicked, receives reminder.id.
 * @param {function} props.onDelete - Callback function when the Delete button is clicked, receives reminder.id.
 * @returns {JSX.Element|null} The rendered reminder item or null if reminder data is invalid.
 */
const ReminderItem = React.memo(({ reminder, onEdit, onDelete }) => {
  const theme = useTheme();

  // Defensive check for required reminder properties
  if (
    !reminder ||
    typeof reminder.id === 'undefined' ||
    typeof reminder.text !== 'string' ||
    typeof reminder.date === 'undefined'
  ) {
    console.warn('ReminderItem received invalid reminder prop:', reminder);
    // Render nothing if essential data is missing to avoid runtime errors
    return null;
  }

  let formattedDate = 'Invalid Date';
  try {
    // Determine the date object to format. Handles JS Date, Firestore Timestamps, and basic date strings.
    let dateToFormat = null;
    if (reminder.date instanceof Date) {
      dateToFormat = reminder.date;
    } else if (reminder.date && typeof reminder.date.toDate === 'function') {
      // Handle Firestore Timestamp objects by converting them first
      dateToFormat = reminder.date.toDate();
    } else if (typeof reminder.date === 'string') {
       // Attempt to parse if it's a string (ISO format recommended)
       const parsedDate = new Date(reminder.date);
       // Check if parsing resulted in a valid date
       if (!isNaN(parsedDate.getTime())) {
           dateToFormat = parsedDate;
       }
    }

    // Only attempt to format if we have a valid Date object
    if (dateToFormat instanceof Date && !isNaN(dateToFormat.getTime())) {
        // Assuming formatDate utility handles valid Date objects
        const result = formatDate(dateToFormat);
        // Use the result only if it's a non-empty string
        if (result && typeof result === 'string' && result.trim() !== '') {
             formattedDate = result;
        } else {
             // Log if formatDate returns something unexpected for a valid date
             console.warn(`formatDate returned invalid result for date: ${dateToFormat}`);
             // Keep 'Invalid Date' or use a default format
             formattedDate = dateToFormat.toLocaleDateString(); // Basic fallback
        }
    } else {
        // Log if the initial date prop could not be resolved to a valid Date object
        console.warn(`Could not parse or convert reminder date:`, reminder.date);
    }
  } catch (error) {
    // Catch errors during date processing or formatting
    console.error(`Error formatting date for reminder ${reminder.id}:`, error);
    // Keep formattedDate as 'Invalid Date'
  }

  // Handler for the edit action
  const handleEditClick = () => {
    onEdit(reminder.id);
  };

  // Handler for the delete action
  const handleDeleteClick = () => {
    onDelete(reminder.id);
  };

  return (
    <Flex
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
      alignItems="center" // Vertically align text/date and buttons
      _hover={{ // Add visual feedback on hover
        boxShadow: 'sm',
        borderColor: 'gray.300',
      }}
      w="100%" // Ensure item takes full width within its container (VStack in ReminderList)
      bg="white" // Explicit background for better layering if container has color
    >
      {/* Reminder Text and Date Section */}
      <Box flex="1" mr={4} minWidth={0}> {/* flex=1 allows shrinking, minWidth=0 prevents overflow issues */}
        <Text
          fontFamily={theme.fonts.body || 'sans-serif'}
          mb={1}
          noOfLines={3} // Limit text lines to prevent excessive height
          wordBreak="break-word" // Allow long words to break
        >
          {reminder.text}
        </Text>
        <Text
          fontSize="sm"
          color="gray.500"
          fontFamily={theme.fonts.body || 'sans-serif'}
        >
          {formattedDate}
        </Text>
      </Box>

      {/* Spacer is optional if Flex justify-content is used, but explicit here */}
      {/* <Spacer /> */}

      {/* Action Buttons Section */}
      <HStack spacing={2}>
        <IconButton
          icon={<EditIcon />}
          aria-label="Edit reminder"
          variant="ghost"
          size="sm"
          onClick={handleEditClick}
          colorScheme="gray" // Neutral color scheme for edit
          title="Edit reminder" // Tooltip for clarity
        />
        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete reminder"
          variant="ghost"
          size="sm"
          colorScheme="red" // Use red color scheme for delete action
          onClick={handleDeleteClick}
          title="Delete reminder" // Tooltip for clarity
        />
      </HStack>
    </Flex>
  );
});

// Add display name for better debugging in React DevTools
ReminderItem.displayName = 'ReminderItem';

// Define prop types for the component for validation and documentation
ReminderItem.propTypes = {
  /**
   * The reminder object containing its details.
   */
  reminder: PropTypes.shape({
    /** The unique identifier for the reminder (string from Firestore ID). */
    id: PropTypes.string.isRequired,
    /** The text content of the reminder. */
    text: PropTypes.string.isRequired,
    /**
     * The target date for the reminder. Expected to be a JS Date object
     * after conversion from Firestore Timestamp by the service layer,
     * but includes checks for Timestamp-like objects or date strings as fallbacks.
     */
    date: PropTypes.oneOfType([
      PropTypes.instanceOf(Date), // Preferred format
      PropTypes.shape({ // Firestore Timestamp duck-typing
        toDate: PropTypes.func.isRequired,
      }),
      PropTypes.string // Basic string fallback
    ]).isRequired,
  }).isRequired,
  /**
   * Callback function triggered when the edit button is clicked.
   * Receives the reminder's ID as an argument.
   */
  onEdit: PropTypes.func.isRequired,
  /**
   * Callback function triggered when the delete button is clicked.
   * Receives the reminder's ID as an argument.
   */
  onDelete: PropTypes.func.isRequired,
};

export default ReminderItem;