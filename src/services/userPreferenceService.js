/**
 * Service for managing user preferences (dark mode, history limit, etc.)
 */

// Get user preference
export const getUserPreference = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('user_preference', {
      fields: ['Id', 'Name', 'dark_mode', 'history_limit', 'default_mode'],
    });

    return response;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
};

// Get a user preference by ID
export const getUserPreferenceById = async (preferenceId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('user_preference', preferenceId, {
      fields: ['Id', 'Name', 'dark_mode', 'history_limit', 'default_mode'],
    });

    return response;
  } catch (error) {
    console.error(`Error fetching user preference with id ${preferenceId}:`, error);
    throw error;
  }
};

// Create a new user preference
export const createUserPreference = async (preferenceData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord('user_preference', {
      records: [preferenceData]
    });

    return response;
  } catch (error) {
    console.error('Error creating user preference:', error);
    throw error;
  }
};

// Update a user preference
export const updateUserPreference = async (preferenceData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Ensure the data has an Id
    if (!preferenceData.Id) {
      throw new Error('Preference ID is required for update');
    }

    const response = await apperClient.updateRecord('user_preference', {
      records: [preferenceData]
    });

    return response;
  } catch (error) {
    console.error('Error updating user preference:', error);
    throw error;
  }
};