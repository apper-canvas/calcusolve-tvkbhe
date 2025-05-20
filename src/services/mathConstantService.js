/**
 * Service for managing mathematical constants
 */

// Get all math constants
export const getMathConstants = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('math_constant', {
      fields: ['Id', 'Name', 'symbol', 'value', 'description', 'Tags'],
    });

    return response;
  } catch (error) {
    console.error('Error fetching math constants:', error);
    throw error;
  }
};

// Get a math constant by ID
export const getMathConstantById = async (constantId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('math_constant', constantId, {
      fields: ['Id', 'Name', 'symbol', 'value', 'description', 'Tags'],
    });

    return response;
  } catch (error) {
    console.error(`Error fetching math constant with id ${constantId}:`, error);
    throw error;
  }
};

// Create a new math constant
export const createMathConstant = async (constantData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord('math_constant', {
      records: [constantData]
    });

    return response;
  } catch (error) {
    console.error('Error creating math constant:', error);
    throw error;
  }
};

// Update a math constant
export const updateMathConstant = async (constantData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Ensure the data has an Id
    if (!constantData.Id) {
      throw new Error('Constant ID is required for update');
    }

    const response = await apperClient.updateRecord('math_constant', {
      records: [constantData]
    });

    return response;
  } catch (error) {
    console.error('Error updating math constant:', error);
    throw error;
  }
};