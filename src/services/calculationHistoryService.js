/**
 * Service for managing calculation history records
 */

// Get calculation history (optionally filtered by user)
export const getCalculationHistory = async (limit = 10) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('calculation_history1', {
      fields: ['Id', 'Name', 'expression', 'result', 'calculation_time', 'mode'],
      orderBy: [
        {
          field: 'calculation_time',
          direction: 'DESC'
        }
      ],
      pagingInfo: {
        limit: limit
      }
    });

    return response;
  } catch (error) {
    console.error('Error fetching calculation history:', error);
    throw error;
  }
};

// Get a calculation history record by ID
export const getCalculationHistoryById = async (historyId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('calculation_history1', historyId, {
      fields: ['Id', 'Name', 'expression', 'result', 'calculation_time', 'mode'],
    });

    return response;
  } catch (error) {
    console.error(`Error fetching calculation history with id ${historyId}:`, error);
    throw error;
  }
};

// Create a new calculation history record
export const createCalculationHistory = async (historyData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord('calculation_history1', {
      records: [historyData]
    });

    return response;
  } catch (error) {
    console.error('Error creating calculation history:', error);
    throw error;
  }
};

// Delete a calculation history record
export const deleteCalculationHistory = async (historyId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord('calculation_history1', {
      RecordIds: [historyId]
    });

    return response;
  } catch (error) {
    console.error(`Error deleting calculation history with id ${historyId}:`, error);
    throw error;
  }
};

// Clear all calculation history for the current user
export const clearCalculationHistory = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // First, fetch all history records to get their IDs
    const historyResponse = await apperClient.fetchRecords('calculation_history1', {
      fields: ['Id'],
    });

    if (historyResponse && historyResponse.data && historyResponse.data.length > 0) {
      // Get all record IDs
      const recordIds = historyResponse.data.map(record => record.Id);
      
      // Delete all records
      const response = await apperClient.deleteRecord('calculation_history1', {
        RecordIds: recordIds
      });

      return response;
    }
    
    return { success: true, message: "No records to delete" };
  } catch (error) {
    console.error('Error clearing calculation history:', error);
    throw error;
  }
};