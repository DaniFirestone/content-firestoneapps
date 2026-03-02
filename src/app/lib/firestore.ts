import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { AppConcept, Business, Task, Asset, AppTask } from './mock-data';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert Firestore Timestamp (or seconds-based object) to ISO string. */
function toISO(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === 'object' && val !== null && 'seconds' in val) {
    return new Date((val as { seconds: number }).seconds * 1000).toISOString();
  }
  if (typeof val === 'string') return val;
  return new Date().toISOString();
}

// --- Status mapping (Firestore ↔ App) ---

const statusToApp: Record<string, AppConcept['status']> = {
  brainstorming: 'brainstorming',
  prototyping: 'prototyping',
  archived: 'archived',
  finalPublished: 'published',
  finalHidden: 'final',
};

const statusToFirestore: Record<string, string> = {
  published: 'finalPublished',
  final: 'finalHidden',
};

function mapStatusToApp(raw: string | undefined): AppConcept['status'] {
  if (!raw) return 'idea';
  return statusToApp[raw] ?? 'idea';
}

function mapStatusToFirestore(status: AppConcept['status']): string {
  return statusToFirestore[status] ?? status;
}

// Phase label derived from status
function phaseFromStatus(status: AppConcept['status']): string {
  const map: Record<string, string> = {
    idea: 'Idea',
    brainstorming: 'Brainstorming',
    prototyping: 'Prototyping',
    final: 'Final',
    published: 'Published',
    archived: 'Archived',
  };
  return map[status] ?? 'Idea';
}

// Progress percentage derived from status
function progressFromStatus(status: AppConcept['status']): number {
  const map: Record<string, number> = {
    idea: 10,
    brainstorming: 25,
    prototyping: 50,
    final: 80,
    published: 100,
    archived: 0,
  };
  return map[status] ?? 0;
}

// Derive a simple health score from tasks array
function deriveHealthScore(tasks: AppTask[]): number {
  if (!tasks || tasks.length === 0) return 50;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

// Map embedded AppTask status → top-level Task status
function mapTaskStatus(raw: string): Task['status'] {
  switch (raw) {
    case 'in_progress':
      return 'in-progress';
    case 'done':
      return 'completed';
    case 'parked':
      return 'todo';
    default:
      return 'todo';
  }
}

// ---------------------------------------------------------------------------
// READ — App Concepts  (firestoneApps)
// ---------------------------------------------------------------------------

export async function getAppConcepts(userId?: string): Promise<AppConcept[]> {
  const ref = collection(db, 'firestoneApps');
  const q = userId ? query(ref, where('userId', '==', userId)) : ref;
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => normalizeAppConcept(d.id, d.data()));
}

export async function getAppConcept(id: string): Promise<AppConcept | null> {
  const snap = await getDoc(doc(db, 'firestoneApps', id));
  if (!snap.exists()) return null;
  return normalizeAppConcept(snap.id, snap.data());
}

function normalizeAppConcept(
  id: string,
  raw: Record<string, unknown>,
): AppConcept {
  const status = mapStatusToApp(raw.status as string | undefined);
  const tasks = Array.isArray(raw.tasks) ? (raw.tasks as AppTask[]) : [];
  const enabledFeatures = Array.isArray(raw.enabledFeatures)
    ? raw.enabledFeatures
    : [];
  const links = Array.isArray(raw.links) ? raw.links : [];
  const tags = Array.isArray(raw.tags) ? raw.tags : [];
  const techStack = Array.isArray(raw.techStack) ? raw.techStack : [];
  const validationCheckpoints = Array.isArray(raw.validationCheckpoints)
    ? raw.validationCheckpoints
    : [];

  const appNameInternal =
    (raw.appNameInternal as string) || (raw.appName as string) || 'Untitled';

  return {
    id,
    userId: (raw.userId as string) ?? '',
    appNameInternal,
    appNamePublished: raw.appNamePublished as string | undefined,
    chromeProfile: raw.chromeProfile as string | undefined,
    slug: (raw.slug as string) ?? '',
    status,

    // DNA Integration
    usesBusinessDNA: Boolean(raw.usesBusinessDNA),
    businessDNAId: raw.businessDNAId as string | undefined,

    // Core Details
    problemStatement: raw.problemStatement as string | undefined,
    solutionStatement: raw.solutionStatement as string | undefined,
    description: (raw.description as string) ?? '',
    longDescription: raw.longDescription as string | undefined,
    appSpecificUSP: raw.appSpecificUSP as string | undefined,

    // Visual Identity
    primaryColor: raw.primaryColor as string | undefined,
    secondaryColor: raw.secondaryColor as string | undefined,
    accentColor: raw.accentColor as string | undefined,
    backgroundColor: raw.backgroundColor as string | undefined,

    // Tasks & Features
    tasks,
    enabledFeatures,
    links,

    // Firebase/Deployment
    hasStaging: Boolean(raw.hasStaging),
    stagingUrl: raw.stagingUrl as string | undefined,
    developmentUrl: raw.developmentUrl as string | undefined,
    firebaseStudioLink: raw.firebaseStudioLink as string | undefined,
    firebaseConsoleLink: raw.firebaseConsoleLink as string | undefined,
    googleCloudProjectId: raw.googleCloudProjectId as string | undefined,
    googleCloudProjectName: raw.googleCloudProjectName as string | undefined,

    // Session & Focus
    isFocused: Boolean(raw.isFocused),
    lastSessionContext: raw.lastSessionContext as string | undefined,
    sessionState: raw.sessionState as AppConcept['sessionState'],

    // Legacy/computed
    phase: phaseFromStatus(status),
    progress: progressFromStatus(status),
    createdAt: toISO(raw.createdAt),
    updatedAt: toISO(raw.updatedAt),
    tags,
    thumbnail: raw.thumbnail as string | undefined,
    businessId:
      (raw.businessDNAId as string) ??
      (raw.businessId as string) ??
      undefined,
    healthScore: (raw.healthScore as number) ?? deriveHealthScore(tasks),
    mainPrompt:
      (raw.mainPrompt as string) ?? (raw.codeSnippet as string) ?? undefined,
    category: raw.category as string | undefined,
    techStack,

    validationCheckpoints,
    keyQuestions: raw.keyQuestions as
      | { question: string; answer?: string }[]
      | undefined,
    nextAction: raw.nextAction as string | undefined,

    targetUser: raw.targetUser as string | undefined,
    solutionDescription: raw.solutionDescription as string | undefined,
    marketResearch: raw.marketResearch as string | undefined,
    userInterviewNotes: raw.userInterviewNotes as string | undefined,
    demandEvidence: raw.demandEvidence as string | undefined,
    mvpScope: raw.mvpScope as string | undefined,
    techStackRationale: raw.techStackRationale as string | undefined,
    prototypeUrl: raw.prototypeUrl as string | undefined,
    userFeedback: raw.userFeedback as string | undefined,
    uxPolishNotes: raw.uxPolishNotes as string | undefined,
    marketingPlan: raw.marketingPlan as string | undefined,
    launchStrategy: raw.launchStrategy as string | undefined,

    prototypeAssetIds: raw.prototypeAssetIds as string[] | undefined,
    processIds: raw.processIds as string[] | undefined,

    // Real Firestore extras
    conceptDescription: raw.conceptDescription as string | undefined,
    codeSnippet: raw.codeSnippet as string | undefined,
    icon: raw.icon as string | undefined,
    faviconUrl: raw.faviconUrl as string | undefined,
    appLinkPublished: raw.appLinkPublished as string | undefined,
    ownerId: raw.ownerId as string | undefined,
    ownerName: raw.ownerName as string | undefined,
    primaryColorOverride: raw.primaryColorOverride as string | undefined,
    accentColorOverride: raw.accentColorOverride as string | undefined,
    useAppSpecificColors: raw.useAppSpecificColors as boolean | undefined,
    stagingProjectId: raw.stagingProjectId as string | undefined,
    finalSummary: raw.finalSummary as string | undefined,
    passcode: raw.passcode as string | undefined,
    supportContact: raw.supportContact as string | undefined,
    vibeDocsProjectUrl: raw.vibeDocsProjectUrl as string | undefined,
    developmentNotes: raw.developmentNotes as string | undefined,

    // Computed aliases for DashboardPage / Header
    name: appNameInternal,
    color:
      (raw.primaryColorOverride as string) ??
      (raw.primaryColor as string) ??
      undefined,
  };
}

// ---------------------------------------------------------------------------
// WRITE — App Concepts  (firestoneApps)
// ---------------------------------------------------------------------------

export async function saveAppConcept(
  id: string,
  data: Partial<AppConcept>,
  userId?: string,
): Promise<void> {
  const payload = reverseTransformApp(data);
  if (userId) payload.userId = userId;
  await setDoc(doc(db, 'firestoneApps', id), payload, { merge: true });
}

export async function updateAppConcept(
  id: string,
  data: Partial<AppConcept>,
  userId?: string,
): Promise<void> {
  const payload = reverseTransformApp(data);
  if (userId) payload.userId = userId;
  await updateDoc(doc(db, 'firestoneApps', id), payload);
}

/** Reverse-transform app data before writing to firestoneApps. */
function reverseTransformApp(
  data: Partial<AppConcept>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data };

  // Map status back to Firestore values
  if (data.status) {
    out.status = mapStatusToFirestore(data.status);
  }

  // Map businessId → businessDNAId
  if (data.businessId) {
    out.businessDNAId = data.businessId;
  }

  // Remove computed-only fields that shouldn't be persisted
  delete out.name;
  delete out.color;
  delete out.phase;
  delete out.progress;
  delete out.healthScore;

  return out;
}

export async function deleteAppConcept(id: string): Promise<void> {
  await deleteDoc(doc(db, 'firestoneApps', id));
}

// ---------------------------------------------------------------------------
// WRITE — Businesses  (businessHubs)
// ---------------------------------------------------------------------------

export async function saveBusiness(
  id: string,
  data: Partial<Business>,
  userId?: string,
): Promise<void> {
  const payload: Record<string, unknown> = { ...data };
  if (userId) payload.userId = userId;
  payload.updatedAt = new Date().toISOString();
  if (!payload.createdAt) {
    payload.createdAt = new Date().toISOString();
  }
  await setDoc(doc(db, 'businessHubs', id), payload, { merge: true });
}

export async function deleteBusiness(id: string): Promise<void> {
  await deleteDoc(doc(db, 'businessHubs', id));
}

// ---------------------------------------------------------------------------
// READ — Businesses  (businessHubs)
// ---------------------------------------------------------------------------

export async function getBusinesses(userId?: string): Promise<Business[]> {
  const ref = collection(db, 'businessHubs');
  const q = userId ? query(ref, where('userId', '==', userId)) : ref;
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => normalizeBusiness(d.id, d.data()));
}

export async function getBusiness(id: string): Promise<Business | null> {
  const snap = await getDoc(doc(db, 'businessHubs', id));
  if (!snap.exists()) return null;
  return normalizeBusiness(snap.id, snap.data());
}

function normalizeBusiness(
  id: string,
  raw: Record<string, unknown>,
): Business {
  // Normalize colorPalette — accept both nested object and flat fields
  let colorPalette = raw.colorPalette as Business['colorPalette'];
  if (!colorPalette && raw.primaryColor) {
    colorPalette = {
      primary: { hex: raw.primaryColor as string, usage: 'Primary elements' },
      secondary: {
        hex: (raw.secondaryColor as string) ?? '#333333',
        usage: 'Secondary elements',
      },
      accent: {
        hex: (raw.accentColor as string) ?? '#FF6600',
        usage: 'Highlights',
      },
      background: {
        hex: (raw.backgroundColor as string) ?? '#FFFFFF',
        usage: 'Backgrounds',
      },
    };
  }

  return {
    id,
    userId: (raw.userId as string) ?? '',
    companyName: (raw.companyName as string) ?? '',
    slug: (raw.slug as string) ?? '',
    tagline: (raw.tagline as string) ?? '',
    description: raw.description as string | undefined,
    missionStatement: raw.missionStatement as string | undefined,
    industry: raw.industry as string | undefined,
    category: raw.category as string | undefined,
    status:
      (raw.status as Business['status']) ?? 'active',

    brandVoice: raw.brandVoice as string | undefined,
    brandVoiceCustom: raw.brandVoiceCustom as string | undefined,
    brandPersonality: raw.brandPersonality as string[] | undefined,
    messagingPillars: raw.messagingPillars as Business['messagingPillars'],

    targetAudience: raw.targetAudience as string | undefined,
    uniqueSellingProposition: raw.uniqueSellingProposition as string | undefined,

    colorPalette,
    typography: raw.typography as Business['typography'],
    logoUrls: raw.logoUrls as Business['logoUrls'],
    imagery: raw.imagery as string | undefined,

    styleguideSource: raw.styleguideSource as Business['styleguideSource'],

    primaryColor: raw.primaryColor as string | undefined,
    accentColor: raw.accentColor as string | undefined,

    createdAt: toISO(raw.createdAt),
    updatedAt: toISO(raw.updatedAt),
  };
}

// ---------------------------------------------------------------------------
// READ — Tasks  (extracted from firestoneApps embedded tasks[])
// ---------------------------------------------------------------------------

export async function getTasks(userId?: string): Promise<Task[]> {
  const ref = collection(db, 'firestoneApps');
  const q = userId ? query(ref, where('userId', '==', userId)) : ref;
  const snapshot = await getDocs(q);
  const allTasks: Task[] = [];

  for (const d of snapshot.docs) {
    const raw = d.data();
    const appName =
      (raw.appNameInternal as string) || (raw.appName as string) || 'Unknown';
    const embeddedTasks = Array.isArray(raw.tasks) ? raw.tasks : [];

    for (const t of embeddedTasks as Array<Record<string, unknown>>) {
      allTasks.push({
        id: `${d.id}_${t.id ?? allTasks.length}`,
        title: (t.title as string) ?? '',
        description: (t.notes as string) ?? '',
        status: mapTaskStatus((t.status as string) ?? 'todo'),
        priority: (t.priority as Task['priority']) ?? 'medium',
        relatedApp: appName,
        assignedToAppId: d.id,
        createdAt: toISO(raw.createdAt),
        updatedAt: toISO(raw.updatedAt),
      });
    }
  }

  return allTasks;
}

export async function getTasksByApp(appId: string): Promise<Task[]> {
  const all = await getTasks();
  return all.filter((t) => t.assignedToAppId === appId);
}

// ---------------------------------------------------------------------------
// READ — Assets  (prototypeAssets)
// ---------------------------------------------------------------------------

export async function getAssets(userId?: string): Promise<Asset[]> {
  const ref = collection(db, 'prototypeAssets');
  const q = userId ? query(ref, where('userId', '==', userId)) : ref;
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => normalizeAsset(d.id, d.data()));
}

export async function getAssetsByApp(appId: string): Promise<Asset[]> {
  const all = await getAssets();
  return all.filter((a) => a.assignedToAppId === appId || a.appId === appId);
}

function normalizeAsset(id: string, raw: Record<string, unknown>): Asset {
  const assetType = (raw.assetType as string) ?? (raw.type as string) ?? 'document';
  const validTypes = ['image', 'video', 'document', 'audio', 'code'];

  return {
    id,
    name: (raw.title as string) ?? (raw.name as string) ?? 'Untitled',
    type: (validTypes.includes(assetType) ? assetType : 'document') as Asset['type'],
    category: (raw.category as string) ?? 'General',
    size: (raw.size as string) ?? '',
    url: (raw.assetUrl as string) ?? (raw.url as string) ?? '',
    thumbnail: raw.thumbnail as string | undefined,
    thumbnailUrl: raw.thumbnailUrl as string | undefined,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    createdAt: toISO(raw.createdAt),
    updatedAt: toISO(raw.updatedAt),
    aiGenerated: raw.aiGenerated as boolean | undefined,
    assignedToAppId:
      (raw.appId as string) ?? (raw.assignedToAppId as string) ?? undefined,
    uploadedAt: raw.uploadedAt as string | undefined,
    description: raw.description as string | undefined,
    businessId: raw.businessId as string | undefined,
    appId: raw.appId as string | undefined,
    status: raw.status as string | undefined,
  };
}

// ---------------------------------------------------------------------------
// WRITE — Assets  (prototypeAssets)
// ---------------------------------------------------------------------------

export async function saveAsset(
  id: string,
  data: Partial<Asset>,
  userId?: string,
): Promise<void> {
  const payload: Record<string, unknown> = { ...data };
  if (userId) payload.userId = userId;
  // Map back to Firestore field names
  if (data.name) payload.title = data.name;
  if (data.url) payload.assetUrl = data.url;
  if (data.type) payload.assetType = data.type;
  if (data.assignedToAppId) payload.appId = data.assignedToAppId;
  payload.updatedAt = new Date().toISOString();
  if (!payload.createdAt) {
    payload.createdAt = new Date().toISOString();
  }
  await setDoc(doc(db, 'prototypeAssets', id), payload, { merge: true });
}

export async function deleteAsset(id: string): Promise<void> {
  await deleteDoc(doc(db, 'prototypeAssets', id));
}

// ---------------------------------------------------------------------------
// Claim Ownership  (firestoneApps + businessHubs)
// ---------------------------------------------------------------------------

export async function claimOwnership(uid: string): Promise<number> {
  const collections = ['firestoneApps', 'businessHubs', 'prototypeAssets'];
  let updated = 0;

  for (const col of collections) {
    const snapshot = await getDocs(collection(db, col));
    for (const d of snapshot.docs) {
      const data = d.data();
      if (data.userId !== uid) {
        await updateDoc(doc(db, col, d.id), { userId: uid });
        updated++;
      }
    }
  }

  return updated;
}
