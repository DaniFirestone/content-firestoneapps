import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppConcept, Business, Task, Asset } from '../lib/mock-data';
import {
  getAppConcepts,
  getBusinesses,
  getTasks,
  getAssets,
  saveAppConcept,
  updateAppConcept,
  deleteAppConcept,
  saveBusiness,
  saveAsset,
} from '../lib/firestore';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface DataContextValue {
  appConcepts: AppConcept[];
  businesses: Business[];
  tasks: Task[];
  assets: Asset[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createApp: (app: AppConcept) => Promise<void>;
  updateApp: (app: AppConcept) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  createBusiness: (biz: Business) => Promise<void>;
  updateBusiness: (biz: Business) => Promise<void>;
  createAsset: (asset: Asset) => Promise<void>;
  createTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [appConcepts, setAppConcepts] = useState<AppConcept[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uid = user?.uid;

  const fetchAll = async () => {
    if (!uid) {
      setAppConcepts([]);
      setBusinesses([]);
      setTasks([]);
      setAssets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [apps, biz, tsk, ast] = await Promise.all([
        getAppConcepts(uid),
        getBusinesses(uid),
        getTasks(uid),
        getAssets(uid),
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
  }, [uid]);

  // ---------------------------------------------------------------------------
  // Apps CRUD
  // ---------------------------------------------------------------------------

  const createApp = async (app: AppConcept) => {
    try {
      await saveAppConcept(app.id, app, uid);
      setAppConcepts((prev) => [...prev, app]);
      toast.success('App created');
    } catch (err) {
      console.error('Failed to create app:', err);
      toast.error('Failed to create app');
    }
  };

  const updateApp = async (app: AppConcept) => {
    try {
      await updateAppConcept(app.id, app, uid);
      setAppConcepts((prev) => prev.map((a) => (a.id === app.id ? app : a)));
      toast.success('App updated');
    } catch (err) {
      console.error('Failed to update app:', err);
      toast.error('Failed to update app');
    }
  };

  const deleteApp = async (id: string) => {
    try {
      await deleteAppConcept(id);
      setAppConcepts((prev) => prev.filter((a) => a.id !== id));
      toast.success('App deleted');
    } catch (err) {
      console.error('Failed to delete app:', err);
      toast.error('Failed to delete app');
    }
  };

  // ---------------------------------------------------------------------------
  // Businesses CRUD
  // ---------------------------------------------------------------------------

  const createBusiness = async (biz: Business) => {
    try {
      await saveBusiness(biz.id, biz, uid);
      setBusinesses((prev) => [...prev, biz]);
      toast.success('Business created');
    } catch (err) {
      console.error('Failed to create business:', err);
      toast.error('Failed to create business');
    }
  };

  const updateBusiness = async (biz: Business) => {
    try {
      await saveBusiness(biz.id, biz, uid);
      setBusinesses((prev) => prev.map((b) => (b.id === biz.id ? biz : b)));
      toast.success('Business updated');
    } catch (err) {
      console.error('Failed to update business:', err);
      toast.error('Failed to update business');
    }
  };

  // ---------------------------------------------------------------------------
  // Assets CRUD
  // ---------------------------------------------------------------------------

  const createAssetFn = async (asset: Asset) => {
    try {
      await saveAsset(asset.id, asset, uid);
      setAssets((prev) => [...prev, asset]);
      toast.success('Asset created');
    } catch (err) {
      console.error('Failed to create asset:', err);
      toast.error('Failed to create asset');
    }
  };

  // ---------------------------------------------------------------------------
  // Tasks CRUD (local state — tasks are embedded in apps in Firestore)
  // ---------------------------------------------------------------------------

  const createTaskFn = async (task: Task) => {
    try {
      setTasks((prev) => [...prev, task]);
      toast.success('Task created');
    } catch (err) {
      console.error('Failed to create task:', err);
      toast.error('Failed to create task');
    }
  };

  const updateTaskFn = async (task: Task) => {
    try {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      toast.success('Task updated');
    } catch (err) {
      console.error('Failed to update task:', err);
      toast.error('Failed to update task');
    }
  };

  return (
    <DataContext.Provider
      value={{
        appConcepts,
        businesses,
        tasks,
        assets,
        loading,
        error,
        refetch: fetchAll,
        createApp,
        updateApp,
        deleteApp,
        createBusiness,
        updateBusiness,
        createAsset: createAssetFn,
        createTask: createTaskFn,
        updateTask: updateTaskFn,
      }}
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
