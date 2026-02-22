// Concept management utilities for app operations
import { type AppConcept } from './mock-data';
import { mockFirestoneApps } from './mock-apps-new';

const STORAGE_KEY = 'content-hub-concept-updates';

export interface ConceptUpdate {
  id: string;
  updates: Partial<AppConcept>;
  timestamp: string;
}

// Load concept updates from localStorage
export function loadConceptUpdates(): Record<string, Partial<AppConcept>> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const updates: ConceptUpdate[] = JSON.parse(stored);
      const result: Record<string, Partial<AppConcept>> = {};
      updates.forEach(update => {
        result[update.id] = update.updates;
      });
      return result;
    }
  } catch (error) {
    console.error('Error loading concept updates:', error);
  }
  
  return {};
}

// Save concept update
export function saveConceptUpdate(conceptId: string, updates: Partial<AppConcept>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const allUpdates = loadConceptUpdates();
    allUpdates[conceptId] = {
      ...allUpdates[conceptId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    const updatesArray: ConceptUpdate[] = Object.entries(allUpdates).map(([id, updates]) => ({
      id,
      updates,
      timestamp: updates.updatedAt || new Date().toISOString(),
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatesArray));
  } catch (error) {
    console.error('Error saving concept update:', error);
  }
}

// Get concept with updates applied
export function getConceptWithUpdates(conceptId: string): AppConcept | null {
  const concept = mockFirestoneApps.find(c => c.id === conceptId);
  if (!concept) return null;
  
  const updates = loadConceptUpdates();
  if (updates[conceptId]) {
    return { ...concept, ...updates[conceptId] } as AppConcept;
  }
  
  return concept;
}

// Get all concepts with updates applied
export function getAllConceptsWithUpdates(): AppConcept[] {
  const updates = loadConceptUpdates();
  return mockFirestoneApps.map(concept => {
    if (updates[concept.id]) {
      return { ...concept, ...updates[concept.id] } as AppConcept;
    }
    return concept;
  });
}

// Change stage
export function changeConceptStage(
  conceptId: string,
  newStage: 'idea' | 'brainstorming' | 'prototyping' | 'final' | 'published' | 'archived'
): void {
  saveConceptUpdate(conceptId, {
    status: newStage,
    updatedAt: new Date().toISOString(),
  });
}

// Archive concept
export function archiveConcept(conceptId: string, reason?: string): void {
  saveConceptUpdate(conceptId, {
    status: 'archived',
    updatedAt: new Date().toISOString(),
    // Store archive reason in a custom field if needed
  });
}

// Duplicate concept
export function duplicateConcept(concept: AppConcept): AppConcept {
  const newId = `${concept.id}-copy-${Date.now()}`;
  const duplicated: AppConcept = {
    ...concept,
    id: newId,
    appNameInternal: `${concept.appNameInternal} (Copy)`,
    slug: `${concept.slug}-copy-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'idea', // Reset to idea stage
    tasks: concept.tasks.map(task => ({
      ...task,
      id: `${task.id}-copy-${Date.now()}`,
      status: 'todo', // Reset task status
    })),
    validationCheckpoints: [], // Clear checkpoints
  };
  
  // Save as a new concept update
  saveConceptUpdate(newId, duplicated);
  
  return duplicated;
}

// Delete concept (soft delete by archiving)
export function deleteConcept(conceptId: string): void {
  archiveConcept(conceptId);
  // In a real app, this would actually delete or mark as deleted
}

// Clear all updates (for testing)
export function clearAllUpdates(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
