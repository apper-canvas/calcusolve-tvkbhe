import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  // Icon components
  const HomeIcon = getIcon('Home');
  const FrownIcon = getIcon('Frown');
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card max-w-md mx-auto p-8 md:p-10">
        <FrownIcon className="w-16 h-16 mx-auto mb-6 text-surface-400 dark:text-surface-500" />
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center justify-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Return Home</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default NotFound;