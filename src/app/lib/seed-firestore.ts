import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { mockAppConcepts, mockBusinesses, mockTasks, mockAssets } from './mock-data';
import { mockFirestoneApps } from './mock-apps-new';

/**
 * Seed Firestore with all mock data, scoped to the authenticated user.
 * Uses setDoc (merge) so it's safe to run multiple times — existing docs get overwritten.
 * Writes to the actual production collections (firestoneApps, businessHubs, prototypeAssets).
 * Tasks are embedded inside app documents, not stored in a separate collection.
 */
export async function seedFirestore(userId: string): Promise<{
  appConcepts: number;
  businesses: number;
  tasks: number;
  assets: number;
}> {
  // Combine both sets of app concepts
  const allAppConcepts = [...mockAppConcepts, ...mockFirestoneApps];

  // Build a map of tasks by assignedToAppId so we can embed them in app docs
  const tasksByApp = new Map<string, typeof mockTasks>();
  for (const task of mockTasks) {
    const appId = task.assignedToAppId ?? '';
    if (!tasksByApp.has(appId)) tasksByApp.set(appId, []);
    tasksByApp.get(appId)!.push(task);
  }

  // Seed app concepts → firestoneApps collection
  for (const concept of allAppConcepts) {
    const { id, ...data } = concept;
    const appTasks = tasksByApp.get(id) ?? [];
    // Embed tasks as an array within the app document
    const embeddedTasks = appTasks.map((t) => ({
      id: t.id,
      title: t.title,
      notes: t.description,
      status: t.status === 'in-progress' ? 'in_progress' : t.status === 'completed' ? 'done' : 'todo',
      priority: t.priority,
    }));
    await setDoc(doc(db, 'firestoneApps', id), {
      ...data,
      id,
      userId,
      tasks: embeddedTasks.length > 0 ? embeddedTasks : (data as Record<string, unknown>).tasks ?? [],
    });
  }

  // Seed businesses → businessHubs collection
  for (const biz of mockBusinesses) {
    const { id, ...data } = biz;
    await setDoc(doc(db, 'businessHubs', id), { ...data, id, userId });
  }

  // Seed assets → prototypeAssets collection
  for (const asset of mockAssets) {
    const { id, ...data } = asset;
    await setDoc(doc(db, 'prototypeAssets', id), { ...data, id, userId });
  }

  return {
    appConcepts: allAppConcepts.length,
    businesses: mockBusinesses.length,
    tasks: mockTasks.length,
    assets: mockAssets.length,
  };
}
