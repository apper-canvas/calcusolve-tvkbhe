/**
 * Service for managing mathematical functions
 */

// Get all math functions
export const getMathFunctions = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('math_function', {
      fields: ['Id', 'Name', 'symbol', 'description', 'category', 'error_message', 'Tags'],
    });

    return response;
  } catch (error) {
    console.error('Error fetching math functions:', error);
    throw error;
  }
};

// Get a math function by ID
export const getMathFunctionById = async (functionId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('math_function', functionId, {
      fields: ['Id', 'Name', 'symbol', 'description', 'category', 'error_message', 'Tags'],
    });

    return response;
  } catch (error) {
    console.error(`Error fetching math function with id ${functionId}:`, error);
    throw error;
  }
};

// Get math functions by category
export const getMathFunctionsByCategory = async (category) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('math_function', {
      fields: ['Id', 'Name', 'symbol', 'description', 'category', 'error_message', 'Tags'],
      where: [
        {
          fieldName: 'category',
          operator: 'ExactMatch',
          values: [category]
        }
      ]
    });

    return response;
  } catch (error) {
    console.error(`Error fetching math functions with category ${category}:`, error);
    throw error;
  }
};

// Create a new math function
export const createMathFunction = async (functionData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord('math_function', {
      records: [functionData]
    });

    return response;
  } catch (error) {
    console.error('Error creating math function:', error);
    throw error;
  }
};

// Update a math function
export const updateMathFunction = async (functionData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Ensure the data has an Id
    if (!functionData.Id) {
      throw new Error('Function ID is required for update');
    }

    const response = await apperClient.updateRecord('math_function', {
      records: [functionData]
    });

    return response;
  } catch (error) {
    console.error('Error updating math function:', error);
    throw error;
  }
};