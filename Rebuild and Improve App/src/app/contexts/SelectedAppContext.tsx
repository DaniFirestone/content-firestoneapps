import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SelectedApp {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface SelectedAppContextType {
  selectedApp: SelectedApp | null;
  setSelectedApp: (app: SelectedApp | null) => void;
  previousApp: SelectedApp | null;
  undoSelection: () => void;
  canUndo: boolean;
}

const SelectedAppContext = createContext<SelectedAppContextType | undefined>(undefined);

const STORAGE_KEY = 'content-hub-selected-app';
const UNDO_TIMEOUT = 30000; // 30 seconds

export function SelectedAppProvider({ children }: { children: React.ReactNode }) {
  const [selectedApp, setSelectedAppState] = useState<SelectedApp | null>(() => {
    // Load from sessionStorage on mount
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading selected app from storage:', error);
    }
    return null;
  });

  const [previousApp, setPreviousApp] = useState<SelectedApp | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const setSelectedApp = (app: SelectedApp | null) => {
    // Save current app as previous before changing
    if (selectedApp) {
      setPreviousApp(selectedApp);
      setCanUndo(true);
      
      // Clear existing timer
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
      
      // Set new timer to disable undo after 30 seconds
      undoTimerRef.current = setTimeout(() => {
        setCanUndo(false);
        setPreviousApp(null);
      }, UNDO_TIMEOUT);
    }
    
    setSelectedAppState(app);
    
    // Update sessionStorage
    if (typeof window !== 'undefined') {
      try {
        if (app) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(app));
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error saving selected app to storage:', error);
      }
    }
  };

  const undoSelection = () => {
    if (canUndo && previousApp) {
      const temp = selectedApp;
      setSelectedAppState(previousApp);
      
      // Update sessionStorage
      if (typeof window !== 'undefined') {
        try {
          if (previousApp) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(previousApp));
          }
        } catch (error) {
          console.error('Error saving selected app to storage:', error);
        }
      }
      
      setPreviousApp(temp);
      
      // Clear timer and reset undo state
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
      setCanUndo(false);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  return (
    <SelectedAppContext.Provider value={{ selectedApp, setSelectedApp, previousApp, undoSelection, canUndo }}>
      {children}
    </SelectedAppContext.Provider>
  );
}

export function useSelectedApp() {
  const context = useContext(SelectedAppContext);
  if (context === undefined) {
    throw new Error('useSelectedApp must be used within a SelectedAppProvider');
  }
  return context;
}