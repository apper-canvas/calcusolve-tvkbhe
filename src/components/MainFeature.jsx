import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { evaluate } from 'mathjs';

function MainFeature() {
  // Icon components
  const BackspaceIcon = getIcon('Delete');
  const ClockIcon = getIcon('Clock');
  const MinusIcon = getIcon('Minus');
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const DivideIcon = getIcon('Divide');
  const PercentIcon = getIcon('Percent');
  const SquareRootIcon = getIcon('Square');
  const PlusMinusIcon = getIcon('ArrowLeftRight');
  const HistoryIcon = getIcon('History');
  const CopyIcon = getIcon('Copy');
  const CheckIcon = getIcon('Check');
  const TrashIcon = getIcon('Trash2');
  
  // States
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentMode, setCurrentMode] = useState('basic'); // 'basic' or 'scientific'

  // Clear everything
  const clearAll = () => {
    setDisplayValue('0');
    setStoredValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  // Handle digit input
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
  };

  // Handle decimal point
  const inputDot = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.');
    }
  };

  // Handle operator
  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(displayValue);
    
    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operation) {
      try {
        const expr = `${storedValue} ${operation} ${inputValue}`;
        const result = evaluate(expr);
        setDisplayValue(String(result));
        setStoredValue(result);
        
        // Add to history
        addToHistory(expr, result);
      } catch (error) {
        toast.error('Invalid calculation');
        clearAll();
        return;
      }
    }
    
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  // Equals function
  const handleEquals = () => {
    const inputValue = parseFloat(displayValue);
    
    if (storedValue === null) {
      return;
    }
    
    if (operation) {
      try {
        const expr = `${storedValue} ${operation} ${inputValue}`;
        const result = evaluate(expr);
        
        // Add to history
        addToHistory(expr, result);
        
        setDisplayValue(String(result));
        setStoredValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      } catch (error) {
        toast.error('Invalid calculation');
        clearAll();
      }
    }
  };

  // Backspace function
  const handleBackspace = () => {
    if (waitingForOperand) return;
    
    setDisplayValue(
      displayValue.length === 1 ? '0' : displayValue.slice(0, -1)
    );
  };

  // Toggle positive/negative
  const toggleSign = () => {
    const value = parseFloat(displayValue);
    setDisplayValue(String(-value));
  };

  // Calculate percentage
  const calculatePercentage = () => {
    const value = parseFloat(displayValue);
    setDisplayValue(String(value / 100));
  };

  // Square root calculation
  const calculateSquareRoot = () => {
    const value = parseFloat(displayValue);
    
    if (value < 0) {
      toast.error('Cannot calculate square root of negative number');
      return;
    }
    
    try {
      const result = Math.sqrt(value);
      setDisplayValue(String(result));
      
      // Add to history
      addToHistory(`sqrt(${value})`, result);
    } catch (error) {
      toast.error('Calculation error');
    }
  };

  // Add calculation to history
  const addToHistory = (expression, result) => {
    const newEntry = {
      expression,
      result: String(result),
      time: new Date().toLocaleTimeString()
    };
    
    setHistory(prevHistory => {
      // Keep latest 10 entries
      const updatedHistory = [newEntry, ...prevHistory];
      if (updatedHistory.length > 10) {
        return updatedHistory.slice(0, 10);
      }
      return updatedHistory;
    });
  };

  // Copy result to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayValue).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Copied to clipboard');
      },
      () => {
        toast.error('Failed to copy to clipboard');
      }
    );
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    toast.info('History cleared');
  };

  // Use saved calculation from history
  const useFromHistory = (result) => {
    setDisplayValue(result);
    setWaitingForOperand(false);
    setShowHistory(false);
  };

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Calculator mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-surface-200 dark:bg-surface-700 rounded-full p-1 inline-flex">
          <button
            className={`px-4 py-2 rounded-full transition-colors ${
              currentMode === 'basic'
                ? 'bg-white dark:bg-surface-800 shadow-sm text-primary dark:text-primary-light font-medium'
                : 'text-surface-600 dark:text-surface-400'
            }`}
            onClick={() => setCurrentMode('basic')}
          >
            Basic
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-colors ${
              currentMode === 'scientific'
                ? 'bg-white dark:bg-surface-800 shadow-sm text-primary dark:text-primary-light font-medium'
                : 'text-surface-600 dark:text-surface-400'
            }`}
            onClick={() => setCurrentMode('scientific')}
          >
            Scientific
          </button>
        </div>
      </div>
      
      {/* Calculator main container */}
      <div className="card p-4 md:p-6 neumorphic-light dark:neumorphic-dark">
        {/* Display */}
        <div className="mb-4 relative">
          <div className="calc-display h-20 md:h-24 text-3xl md:text-4xl flex items-end justify-end">
            {displayValue}
          </div>
          
          <div className="absolute top-3 right-3 flex space-x-2">
            <button 
              onClick={copyToClipboard}
              className="p-1 text-surface-400 hover:text-primary dark:text-surface-500 dark:hover:text-primary-light rounded-md transition-colors"
              aria-label="Copy result"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <CopyIcon className="w-5 h-5" />
              )}
            </button>
            
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-1 rounded-md transition-colors ${
                showHistory 
                  ? 'text-primary dark:text-primary-light' 
                  : 'text-surface-400 hover:text-primary dark:text-surface-500 dark:hover:text-primary-light'
              }`}
              aria-label="Show history"
            >
              <HistoryIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* History panel */}
        {showHistory && (
          <motion.div 
            className="mb-4 p-3 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 max-h-60 overflow-y-auto scrollbar-hide"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400">
                Calculation History
              </h3>
              
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="p-1 text-surface-400 hover:text-red-500 dark:text-surface-500 dark:hover:text-red-400 rounded-md transition-colors"
                  aria-label="Clear history"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <p className="text-surface-400 dark:text-surface-500 text-center py-2 text-sm">
                No calculation history yet
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((entry, index) => (
                  <li 
                    key={index}
                    className="p-2 rounded-md bg-white dark:bg-surface-700 shadow-sm border border-surface-200 dark:border-surface-600 hover:border-primary dark:hover:border-primary-light transition-colors cursor-pointer"
                    onClick={() => useFromHistory(entry.result)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" /> {entry.time}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {entry.expression}
                      </p>
                      <p className="text-base font-medium text-surface-800 dark:text-surface-200">
                        = {entry.result}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
        
        {/* Calculator keypad */}
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {/* Row 1 */}
          <button onClick={clearAll} className="calc-button-function col-span-1">
            C
          </button>
          <button onClick={calculatePercentage} className="calc-button-function">
            <PercentIcon className="w-5 h-5" />
          </button>
          <button onClick={toggleSign} className="calc-button-function">
            <PlusMinusIcon className="w-5 h-5" />
          </button>
          <button onClick={() => performOperation('/')} className="calc-button-operation">
            <DivideIcon className="w-5 h-5" />
          </button>
          
          {/* Row 2 */}
          <button onClick={() => inputDigit(7)} className="calc-button-number">
            7
          </button>
          <button onClick={() => inputDigit(8)} className="calc-button-number">
            8
          </button>
          <button onClick={() => inputDigit(9)} className="calc-button-number">
            9
          </button>
          <button onClick={() => performOperation('*')} className="calc-button-operation">
            <XIcon className="w-5 h-5" />
          </button>
          
          {/* Row 3 */}
          <button onClick={() => inputDigit(4)} className="calc-button-number">
            4
          </button>
          <button onClick={() => inputDigit(5)} className="calc-button-number">
            5
          </button>
          <button onClick={() => inputDigit(6)} className="calc-button-number">
            6
          </button>
          <button onClick={() => performOperation('-')} className="calc-button-operation">
            <MinusIcon className="w-5 h-5" />
          </button>
          
          {/* Row 4 */}
          <button onClick={() => inputDigit(1)} className="calc-button-number">
            1
          </button>
          <button onClick={() => inputDigit(2)} className="calc-button-number">
            2
          </button>
          <button onClick={() => inputDigit(3)} className="calc-button-number">
            3
          </button>
          <button onClick={() => performOperation('+')} className="calc-button-operation">
            <PlusIcon className="w-5 h-5" />
          </button>
          
          {/* Row 5 */}
          <button onClick={() => inputDigit(0)} className="calc-button-number col-span-1">
            0
          </button>
          <button onClick={inputDot} className="calc-button-number">
            .
          </button>
          <button onClick={handleBackspace} className="calc-button-function">
            <BackspaceIcon className="w-5 h-5" />
          </button>
          <button onClick={handleEquals} className="calc-button-equals">
            =
          </button>
        </div>
        
        {/* Scientific calculator additional keys (conditionally rendered) */}
        {currentMode === 'scientific' && (
          <div className="grid grid-cols-4 gap-2 md:gap-3 mt-3 border-t border-surface-200 dark:border-surface-700 pt-3">
            <button 
              onClick={calculateSquareRoot} 
              className="calc-button-function"
              aria-label="Square root"
            >
              <SquareRootIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const value = parseFloat(displayValue);
                const result = value * value;
                setDisplayValue(String(result));
                addToHistory(`${value}^2`, result);
              }} 
              className="calc-button-function"
              aria-label="Square"
            >
              x²
            </button>
            <button 
              onClick={() => {
                const value = parseFloat(displayValue);
                if (value === 0) {
                  toast.error("Cannot divide by zero");
                  return;
                }
                const result = 1 / value;
                setDisplayValue(String(result));
                addToHistory(`1/${value}`, result);
              }} 
              className="calc-button-function"
              aria-label="Reciprocal"
            >
              1/x
            </button>
            <button 
              onClick={() => {
                const value = parseFloat(displayValue);
                const result = Math.abs(value);
                setDisplayValue(String(result));
                addToHistory(`|${value}|`, result);
              }} 
              className="calc-button-function"
              aria-label="Absolute"
            >
              |x|
            </button>
            
            <button 
              onClick={() => {
                const result = Math.PI;
                setDisplayValue(String(result));
              }} 
              className="calc-button-function"
              aria-label="PI"
            >
              π
            </button>
            <button 
              onClick={() => {
                const result = Math.E;
                setDisplayValue(String(result));
              }} 
              className="calc-button-function"
              aria-label="Euler's number"
            >
              e
            </button>
            <button 
              onClick={() => {
                const value = parseFloat(displayValue);
                try {
                  const result = Math.log10(value);
                  if (isNaN(result) || !isFinite(result)) {
                    toast.error("Invalid input for logarithm");
                    return;
                  }
                  setDisplayValue(String(result));
                  addToHistory(`log(${value})`, result);
                } catch (err) {
                  toast.error("Calculation error");
                }
              }} 
              className="calc-button-function"
              aria-label="Log base 10"
            >
              log
            </button>
            <button 
              onClick={() => {
                const value = parseFloat(displayValue);
                try {
                  const result = Math.log(value);
                  if (isNaN(result) || !isFinite(result)) {
                    toast.error("Invalid input for natural logarithm");
                    return;
                  }
                  setDisplayValue(String(result));
                  addToHistory(`ln(${value})`, result);
                } catch (err) {
                  toast.error("Calculation error");
                }
              }} 
              className="calc-button-function"
              aria-label="Natural logarithm"
            >
              ln
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainFeature;