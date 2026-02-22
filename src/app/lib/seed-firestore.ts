import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { mockAppConcepts, mockBusinesses, mockTasks, mockAssets } from './mock-data';
import { mockFirestoneApps } from './mock-apps-new';

/**
 * Seed Firestore with all mock data.
 * Uses setDoc (merge) so it's safe to run multiple times — existing docs get overwritten.
 */
export async function seedFirestore(): Promise<{
  appConcepts: number;
  businesses: number;
  tasks: number;
  assets: number;
}> {
  // Combine both sets of app concepts
  const allAppConcepts = [...mockAppConcepts, ...mockFirestoneApps];

  // Seed app concepts
  for (const concept of allAppConcepts) {
    const { id, ...data } = concept;
    await setDoc(doc(db, 'appConcepts', id), { ...data, id });
  }

  // Seed businesses
  for (const biz of mockBusinesses) {
    const { id, ...data } = biz;
    await setDoc(doc(db, 'businesses', id), { ...data, id });
  }

  // Seed tasks
  for (const task of mockTasks) {
    const { id, ...data } = task;
    await setDoc(doc(db, 'tasks', id), { ...data, id });
  }

  // Seed assets
  for (const asset of mockAssets) {
    const { id, ...data } = asset;
    await setDoc(doc(db, 'assets', id), { ...data, id });
  }

  return {
    appConcepts: allAppConcepts.length,
    businesses: mockBusinesses.length,
    tasks: mockTasks.length,
    assets: mockAssets.length,
  };
}
