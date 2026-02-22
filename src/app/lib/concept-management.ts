// Concept management utilities for app operations — backed by Firestore
import { type AppConcept } from './mock-data';
import {
  getAppConcepts,
  getAppConcept,
  saveAppConcept,
  updateAppConcept,
} from './firestore';

// Get concept by id
export async function getConceptWithUpdates(
  conceptId: string,
): Promise<AppConcept | null> {
  return getAppConcept(conceptId);
}

// Get all concepts
export async function getAllConceptsWithUpdates(): Promise<AppConcept[]> {
  return getAppConcepts();
}

// Save partial update to a concept
export async function saveConceptUpdate(
  conceptId: string,
  updates: Partial<AppConcept>,
): Promise<void> {
  await updateAppConcept(conceptId, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

// Change stage
export async function changeConceptStage(
  conceptId: string,
  newStage:
    | 'idea'
    | 'brainstorming'
    | 'prototyping'
    | 'final'
    | 'published'
    | 'archived',
): Promise<void> {
  await saveConceptUpdate(conceptId, {
    status: newStage,
  });
}

// Archive concept
export async function archiveConcept(conceptId: string): Promise<void> {
  await saveConceptUpdate(conceptId, {
    status: 'archived',
  });
}

// Duplicate concept
export async function duplicateConcept(
  concept: AppConcept,
): Promise<AppConcept> {
  const newId = `${concept.id}-copy-${Date.now()}`;
  const duplicated: AppConcept = {
    ...concept,
    id: newId,
    appNameInternal: `${concept.appNameInternal} (Copy)`,
    slug: `${concept.slug}-copy-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'idea',
    tasks: concept.tasks.map((task) => ({
      ...task,
      id: `${task.id}-copy-${Date.now()}`,
      status: 'todo' as const,
    })),
    validationCheckpoints: [],
  };

  await saveAppConcept(newId, duplicated);
  return duplicated;
}

// Delete concept (soft delete by archiving)
export async function deleteConcept(conceptId: string): Promise<void> {
  await archiveConcept(conceptId);
}
