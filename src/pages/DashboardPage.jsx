import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Alert,
  AlertIcon,
  Center,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'; // Import AddIcon for the button
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  getReminders,
  addReminder,
  updateReminder,
  deleteReminder,
} from '../services/reminderService.js';
import ReminderList from '../components/ReminderList.jsx';
import ReminderForm from '../components/ReminderForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

/**
 * DashboardPage Component
 *
 * Serves as the main view for authenticated users. Displays a list of personal reminders,
 * allows users to add, edit, and delete reminders, and handles data fetching and updates
 * via the reminder service.
 */
const DashboardPage = () => {
  // Authentication Context
  const { currentUser } = useAuth();

  // Component State
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true); // Tracks fetching reminders
  const [error, setError] = useState(null); // Stores general page errors (fetch/delete)
  const [formError, setFormError] = useState(null); // Stores errors specific to form submission
  const [selectedReminder, setSelectedReminder] = useState(null); // Reminder being edited
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission state

  // Modal State (for Add/Edit Reminder Form)
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Toast Notifications
  const toast = useToast();

  // --- Data Fetching ---
  /**
   * Fetches reminders for the current user.
   * Wrapped in useCallback to potentially be used as a stable refresh function.
   */
  const fetchReminders = useCallback(async () => {
    if (!currentUser?.uid) {
      setError('User not authenticated. Cannot fetch reminders.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors before fetch

    try {
      const fetchedReminders = await getReminders(currentUser.uid);
      setReminders(fetchedReminders);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError(
        err.message || 'Failed to fetch reminders. Please try refreshing.'
      );
      // Keep existing reminders (if any) visible on error, rather than clearing
      // setReminders([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]); // Dependency: currentUser.uid

  // Initial data fetch on component mount or when user changes
  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]); // Use the stable fetchReminders function

  // --- Modal and Form Handlers ---

  /**
   * Opens the modal in 'Add' mode.
   */
  const handleOpenAddModal = useCallback(() => {
    setSelectedReminder(null); // Ensure no initial data for add mode
    setFormError(null); // Clear any previous form errors
    onOpen(); // Open the modal
  }, [onOpen]);

  /**
   * Opens the modal in 'Edit' mode with the selected reminder's data.
   * @param {object} reminder - The full reminder object to edit.
   */
  const handleOpenEditModal = useCallback(
    (reminder) => {
      if (!reminder || typeof reminder.id === 'undefined') {
        console.error('handleOpenEditModal called with invalid reminder:', reminder);
        toast({
          title: 'Error',
          description: 'Could not load reminder data for editing.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setSelectedReminder(reminder); // Set the reminder to pre-fill the form
      setFormError(null); // Clear any previous form errors
      onOpen(); // Open the modal
    },
    [onOpen, toast]
  );

  /**
   * Handles the deletion of a reminder.
   * @param {string} reminderId - The ID of the reminder to delete.
   */
  const handleDeleteReminder = useCallback(
    async (reminderId) => {
      if (!currentUser?.uid) {
        toast({
          title: 'Authentication Error',
          description: 'Cannot delete reminder. User not logged in.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (!reminderId) {
        console.error('handleDeleteReminder called with invalid reminderId');
        toast({
          title: 'Error',
          description: 'Invalid reminder selected for deletion.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Optional: Add a confirmation dialog here for better UX
      // if (!window.confirm('Are you sure you want to delete this reminder?')) {
      //   return;
      // }

      // Indicate loading state subtly if needed, maybe disable buttons

      try {
        await deleteReminder(currentUser.uid, reminderId);
        toast({
          title: 'Reminder Deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchReminders(); // Refresh the list after deletion
      } catch (err) {
        console.error(`Error deleting reminder ${reminderId}:`, err);
        setError(
          err.message || 'Failed to delete reminder. Please try again.'
        ); // Show error on the page
        toast({
          title: 'Deletion Failed',
          description:
            err.message || 'Could not delete the reminder. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        // Reset subtle loading indicators if used
      }
    },
    [currentUser?.uid, fetchReminders, toast] // Dependencies
  );

  /**
   * Handles the submission of the ReminderForm (both add and edit).
   * @param {{ text: string, date: string }} formData - Form data with date as 'YYYY-MM-DD' string.
   */
  const handleFormSubmit = useCallback(
    async (formData) => {
      if (!currentUser?.uid) {
        setFormError('User not authenticated. Cannot save reminder.');
        toast({
          title: 'Authentication Error',
          description: 'Cannot save reminder. User not logged in.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Input validation should primarily happen within ReminderForm,
      // but double-check essential fields here if necessary.
      if (!formData || !formData.text || !formData.date) {
          setFormError('Invalid form data received.');
          return;
      }

      // Convert 'YYYY-MM-DD' string back to a Date object for the service
      // Add time component (e.g., start of day) to avoid timezone issues if needed
      const dateParts = formData.date.split('-').map(Number);
      const dateObject = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // Month is 0-indexed

      if (isNaN(dateObject.getTime())) {
          setFormError('Invalid date format processed.');
          return;
      }

      const dataForService = {
        text: formData.text,
        date: dateObject,
      };

      setIsSubmitting(true);
      setFormError(null); // Clear previous form errors

      try {
        if (selectedReminder) {
          // --- Edit Operation ---
          if (!selectedReminder.id) {
            throw new Error("Invalid reminder state: Missing ID for update.");
          }
          await updateReminder(
            currentUser.uid,
            selectedReminder.id,
            dataForService
          );
          toast({
            title: 'Reminder Updated',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          // --- Add Operation ---
          await addReminder(currentUser.uid, dataForService);
          toast({
            title: 'Reminder Added',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }

        // Close modal and refresh list only on successful submission
        onClose();
        setSelectedReminder(null); // Clear selection state
        fetchReminders(); // Refresh the list
      } catch (err) {
        console.error('Error saving reminder:', err);
        const errorMessage = err.message || 'Failed to save reminder. Please try again.';
        setFormError(errorMessage); // Display error within the modal if possible, or use toast
         toast({
           title: 'Save Failed',
           description: errorMessage,
           status: 'error',
           duration: 5000,
           isClosable: true,
         });
        // Do not close modal on error, allow user to retry or cancel
      } finally {
        setIsSubmitting(false); // Reset submission loading state
      }
    },
    [
      currentUser?.uid,
      selectedReminder,
      fetchReminders,
      onClose,
      toast,
    ] // Dependencies
  );

  // Handle case where currentUser is somehow null despite route protection
  if (!currentUser && !loading) {
    return (
      <Center h="calc(100vh - 80px)"> {/* Adjust height based on Navbar */}
        <Alert status="error">
          <AlertIcon />
          Error: User not authenticated. Please log in again.
        </Alert>
      </Center>
    );
  }

  // --- Render Logic ---
  return (
    <Box p={{ base: 4, md: 6 }}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center" wrap="wrap">
          <Heading as="h2" size="xl">
            Your Sweet Reminders
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="pink" // Match theme
            onClick={handleOpenAddModal}
            aria-label="Add new reminder"
          >
            Add Reminder
          </Button>
        </Flex>

        {/* Display Loading State */}
        {loading && (
          <Center py={10}>
            <LoadingSpinner />
          </Center>
        )}

        {/* Display Fetching/General Error State */}
        {!loading && error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Display Reminder List */}
        {!loading && !error && (
          <ReminderList
            reminders={reminders}
            onEdit={handleOpenEditModal} // Pass the correct edit handler
            onDelete={handleDeleteReminder}
          />
          // ReminderList should handle the empty state internally
        )}
      </VStack>

      {/* Add/Edit Reminder Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={{ base: 4, sm: 0 }}> {/* Add horizontal margin on small screens */}
          <ModalHeader>
            {selectedReminder ? 'Edit Reminder' : 'Add New Reminder'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Display Form-specific Error */}
            {formError && (
                <Alert status="error" mb={4} borderRadius="md">
                    <AlertIcon />
                    {formError}
                </Alert>
            )}
            <ReminderForm
              initialData={selectedReminder}
              onSubmit={handleFormSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting} // Pass submission state to form
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DashboardPage;