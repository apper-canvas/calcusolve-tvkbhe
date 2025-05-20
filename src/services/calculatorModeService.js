/**
 * Service for managing calculator modes (basic, scientific, etc.)
 */

// Get all calculator modes
export const getCalculatorModes = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('calculator_mode', {
      fields: ['Id', 'Name', 'display_name', 'is_default', 'Tags'],
    });

    return response;
  } catch (error) {
    console.error('Error fetching calculator modes:', error);
    throw error;
  }
};

// Get a calculator mode by ID
export const getCalculatorModeById = async (modeId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('calculator_mode', modeId, {
      fields: ['Id', 'Name', 'display_name', 'is_default', 'Tags'],
    });

    return response;
  } catch (error) {
    console.error(`Error fetching calculator mode with id ${modeId}:`, error);
    throw error;
  }
};

// Create a new calculator mode
export const createCalculatorMode = async (modeData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord('calculator_mode', {
      records: [modeData]
    });

    return response;
  } catch (error) {
    console.error('Error creating calculator mode:', error);
    throw error;
  }
};

// Update a calculator mode
export const updateCalculatorMode = async (modeData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Ensure the data has an Id
    if (!modeData.Id) {
      throw new Error('Mode ID is required for update');
    }

    const response = await apperClient.updateRecord('calculator_mode', {
      records: [modeData]
    });

    return response;
  } catch (error) {
    console.error('Error updating calculator mode:', error);
    throw error;
  }
};