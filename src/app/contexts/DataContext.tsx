import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppConcept, Business, Task, Asset } from '../lib/mock-data';
import {
  getAppConcepts,
  getBusinesses,
  getTasks,
  getAssets,
} from '../lib/firestore';

interface DataContextValue {
  appConcepts: AppConcept[];
  businesses: Business[];
  tasks: Task[];
  assets: Asset[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [appConcepts, setAppConcepts] = useState<AppConcept[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [apps, biz, tsk, ast] = await Promise.all([
        getAppConcepts(),
        getBusinesses(),
        getTasks(),
        getAssets(),
      ]);
      setAppConcepts(apps);
      setBusinesses(biz);
      setTasks(tsk);
      setAssets(ast);
    } catch (err) {
      console.error('Failed to fetch Firestore data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <DataContext.Provider
      value={{ appConcepts, businesses, tasks, assets, loading, error, refetch: fetchAll }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
