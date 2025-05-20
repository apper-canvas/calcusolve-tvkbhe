import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';

import { getUserPreference, createUserPreference, updateUserPreference } from './services/userPreferenceService';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [userPreference, setUserPreference] = useState(null);

  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed");
        setIsInitialized(true);
      }
    });
  }, [dispatch, navigate]);

  // Load user preferences when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserPreference = async () => {
        setIsLoading(true);
        try {
          const response = await getUserPreference();
          if (response && response.data && response.data.length > 0) {
            setUserPreference(response.data[0]);
            setDarkMode(response.data[0].dark_mode);
          } else {
            // Create default user preference if none exists
            const newPreference = {
              Name: `Preference_${userState.user.userId}`,
              dark_mode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
              history_limit: 10
            };
            const createResponse = await createUserPreference(newPreference);
            if (createResponse && createResponse.results && createResponse.results[0].success) {
              setUserPreference(createResponse.results[0].data);
              setDarkMode(newPreference.dark_mode);
            }
          }
        } catch (error) {
          console.error("Error fetching user preference:", error);
          toast.error("Failed to load preferences");
          // Use system preference as fallback
          setDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserPreference();
    } else {
      // If not authenticated, use system preference
      setDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsLoading(false);
    }
  }, [isAuthenticated, userState]);

  // Update document class when dark mode changes

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  // Toggle dark mode and update user preference in the database
  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (isAuthenticated && userPreference) {
      try {
        await updateUserPreference({
          Id: userPreference.Id,
          dark_mode: newDarkMode
        });
      } catch (error) {
        console.error("Error updating dark mode preference:", error);
      }
    }
    
    setDarkMode(!darkMode);
    toast.info(`${!darkMode ? 'Dark' : 'Light'} mode activated`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: !darkMode ? "dark" : "light"
    });
  };
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed");
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="text-lg text-surface-600 dark:text-surface-300">Initializing application...</div>
    </div>;
  }


    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100 transition-colors duration-300">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/" element={
              isAuthenticated ? 
                <Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} userPreference={userPreference} isLoading={isLoading} /> : 
                <Login />
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          className="text-sm"
        />
      </div>
    </AuthContext.Provider>
    </div>
  );
}

export default App;