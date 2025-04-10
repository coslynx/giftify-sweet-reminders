import React from 'react';
import { VStack, Box, Text } from '@chakra-ui/react';
import ReminderItem from './ReminderItem.jsx'; // Assume ReminderItem component exists

/**
 * Renders a list of reminders or an empty state message.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} [props.reminders=[]] - An array of reminder objects. Each object should have at least `id` (string/number), `text` (string), and `date` (Date object or string). Defaults to an empty array.
 * @param {function} props.onEdit - A callback function triggered when a reminder's edit action is initiated. It receives the reminder's `id` as an argument (e.g., `onEdit(reminderId)`). This function must be passed down to each ReminderItem.
 * @param {function} props.onDelete - A callback function triggered when a reminder's delete action is initiated. It receives the reminder's `id` as an argument (e.g., `onDelete(reminderId)`). This function must be passed down to each ReminderItem.
 * @returns {JSX.Element} The rendered list or empty state.
 */
const ReminderList = ({ reminders = [], onEdit, onDelete }) => {
  // Check if the reminders array is empty or not provided
  if (!reminders || reminders.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500" fontStyle="italic">
          No reminders yet. Time to add one!
        </Text>
      </Box>
    );
  }

  // Render the list of reminders using VStack
  return (
    <VStack spacing={4} align="stretch" w="100%">
      {reminders.map((reminder) => (
        <ReminderItem
          key={reminder.id} // Crucial for React's list reconciliation
          reminder={reminder} // Pass the entire reminder object
          onEdit={onEdit} // Pass the onEdit callback down
          onDelete={onDelete} // Pass the onDelete callback down
        />
      ))}
    </VStack>
  );
};

export default ReminderList;