/**
 * Authentication service for handling user login, logout, and session management
 * using the Apper authentication system.
 */

// Check if the user is authenticated by verifying the Apper token
export const checkAuthentication = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // This will throw an error if not authenticated
    const response = await apperClient.verifyToken();
    return response;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return null;
  }
};

// Log the user out
export const logout = async () => {
  try {
    const { ApperUI } = window.ApperSDK;
    await ApperUI.logout();
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Other authentication related functions can be added here as needed
// Note: Most authentication is handled by ApperUI directly