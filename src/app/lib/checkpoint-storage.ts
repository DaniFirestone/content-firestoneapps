// Checkpoint storage utility for persisting checkpoint state
const STORAGE_KEY = 'content-hub-checkpoints';

export interface CheckpointState {
  [conceptId: string]: string[];
}

export function loadCheckpoints(): CheckpointState {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading checkpoints:', error);
  }
  
  return {};
}

export function saveCheckpoints(checkpoints: CheckpointState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkpoints));
  } catch (error) {
    console.error('Error saving checkpoints:', error);
  }
}

export function saveConceptCheckpoints(conceptId: string, checkpointIds: string[]): void {
  const allCheckpoints = loadCheckpoints();
  allCheckpoints[conceptId] = checkpointIds;
  saveCheckpoints(allCheckpoints);
}

export function getConceptCheckpoints(conceptId: string): string[] {
  const allCheckpoints = loadCheckpoints();
  return allCheckpoints[conceptId] || [];
}
