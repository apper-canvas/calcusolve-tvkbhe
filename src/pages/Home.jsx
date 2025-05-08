import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

function Home({ darkMode, toggleDarkMode }) {
  // Icon components
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const CalculatorIcon = getIcon('Calculator');
  const GithubIcon = getIcon('Github');
  
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CalculatorIcon className="w-6 h-6 text-primary dark:text-primary-light" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CalcuSolve
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-surface-600" />
              )}
            </button>
            
            <a 
              href="https://github.com/username/calcusolve" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Advanced Calculator Utility</h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Perform calculations with ease. Features basic arithmetic, scientific functions, and more.
            </p>
          </div>
          
          <MainFeature />
        </section>
      </main>
      
      <footer className="bg-surface-100 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-surface-500 dark:text-surface-400">
          <p>© {new Date().getFullYear()} CalcuSolve. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  );
}

export default Home;