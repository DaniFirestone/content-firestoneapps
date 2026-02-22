import type { AppConcept, AppTask, AppFeature, AppLink, Business, BusinessDNAProfile } from './mock-data';

// New Firestone Apps with full structure
export const mockFirestoneApps: AppConcept[] = [
  {
    id: 'app_789',
    userId: 'user-1',
    appNameInternal: 'LaunchPad',
    appNamePublished: 'LaunchPad by Firestone',
    chromeProfile: 'JFirestone@gmail',
    slug: 'launchpad',
    status: 'prototyping',
    
    usesBusinessDNA: true,
    businessDNAId: 'dna_ent_456',
    businessId: '1',
    
    problemStatement: 'Indie founders waste weeks setting up boilerplate before they can validate their idea.',
    solutionStatement: 'A pre-wired starter kit with auth, DB, and brand theming out of the box.',
    description: 'Ship your next app in a weekend.',
    longDescription: 'LaunchPad gives solo founders a production-ready Next.js starter with Firebase, auth, and your brand DNA baked in.',
    appSpecificUSP: 'Zero-config brand theming inherited from your Business Hub.',
    
    primaryColor: '#2563EB',
    secondaryColor: '#0F172A',
    accentColor: '#F59E0B',
    backgroundColor: '#F8FAFC',
    
    tasks: [
      { id: 't1', title: 'Set up Firebase Auth', status: 'done', priority: 'high' },
      { id: 't2', title: 'Build onboarding flow', status: 'in_progress', priority: 'high', notes: '3-step wizard' },
      { id: 't3', title: 'Add Stripe checkout', status: 'todo', priority: 'medium' },
      { id: 't4', title: 'Dark mode support', status: 'parked', priority: 'low', notes: 'Revisit after v1' },
    ],
    
    enabledFeatures: [
      { id: 'f1', featureName: 'Authentication', enabled: true, enabledAt: '2026-01-20T10:00:00Z' },
      { id: 'f2', featureName: 'Firestore DB', enabled: true, enabledAt: '2026-01-20T10:00:00Z' },
      { id: 'f3', featureName: 'Payments', enabled: false, notes: 'Waiting on Stripe approval' },
      { id: 'f4', featureName: 'VibeDocs', enabled: true, enabledAt: '2026-02-01T08:00:00Z' },
      { id: 'f5', featureName: 'Admin Emails', enabled: false, excluded: true },
    ],
    
    links: [
      { id: 'l1', title: 'GitHub Repo', url: 'https://github.com/firestone/launchpad', createdAt: '2026-01-15T09:00:00Z' },
      { id: 'l2', title: 'Figma Designs', url: 'https://figma.com/file/abc123', createdAt: '2026-01-20T14:00:00Z' },
    ],
    
    hasStaging: true,
    stagingUrl: 'https://launchpad-staging.web.app',
    developmentUrl: 'http://localhost:3000',
    firebaseStudioLink: 'https://studio.firebase.google.com/launchpad',
    firebaseConsoleLink: 'https://console.firebase.google.com/project/launchpad-prod',
    googleCloudProjectId: 'launchpad-prod',
    googleCloudProjectName: 'LaunchPad Production',
    
    isFocused: true,
    lastSessionContext: 'Working on onboarding wizard step 2',
    sessionState: {
      lastActiveAt: '2026-02-20T17:45:00Z',
      lastActiveTab: 'tasks',
      lastTaskInProgress: 't2',
      contextSnapshot: {
        tasksCompleted: 1,
        tasksInProgress: 1,
        healthScore: 72,
        recentActivity: 'Completed Firebase Auth setup, started onboarding flow',
      },
      userNote: 'Pick up onboarding step 2 — form validation left',
      aiSummary: 'Welcome back! You were building the onboarding wizard. Auth is done, 2 tasks remaining.',
    },
    
    phase: 'Prototyping',
    progress: 40,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-02-20T17:45:00Z',
    tags: ['saas', 'boilerplate', 'firebase'],
    healthScore: 72,
    mainPrompt: 'Create a production-ready Next.js starter with Firebase',
    category: 'Developer Tools',
    techStack: ['Next.js', 'Firebase', 'TypeScript', 'Tailwind CSS'],
    
    validationCheckpoints: ['mvp', 'tech', 'prototype'],
    keyQuestions: [
      { question: "What's the minimum viable version?", answer: 'Auth, DB, basic theming system' },
      { question: 'How will I build this?', answer: 'Next.js 14, Firebase, Tailwind' },
      { question: 'Will people actually use it?', answer: '3 friends already asking for early access' },
    ],
    nextAction: 'Complete onboarding flow form validation',
    
    mvpScope: 'Auth system, Firestore integration, brand theming',
    techStackRationale: 'Next.js for speed, Firebase for quick backend, Tailwind for theming',
    prototypeUrl: 'https://launchpad-staging.web.app',
    userFeedback: 'Love the auto-theming! Onboarding could be simpler.',
    
    prototypeAssetIds: ['asset_101', 'asset_102'],
    processIds: ['proc_001'],
  },
  {
    id: 'app_221',
    userId: 'user-1',
    appNameInternal: 'BooksBridge',
    appNamePublished: 'BooksBridge',
    slug: 'booksbridge',
    status: 'brainstorming',
    
    usesBusinessDNA: false,
    businessId: '2',
    
    problemStatement: 'Book lovers struggle to track their reading across different languages and formats.',
    description: 'Multilingual reading tracker',
    
    tasks: [
      { id: 't1', title: 'Research competitors', status: 'done', priority: 'high' },
      { id: 't2', title: 'Interview readers', status: 'in_progress', priority: 'high' },
    ],
    
    enabledFeatures: [],
    
    links: [],
    
    hasStaging: false,
    isFocused: false,
    
    phase: 'Brainstorming',
    progress: 25,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-19T14:00:00Z',
    tags: ['books', 'reading', 'multilingual'],
    healthScore: 68,
    category: 'Books & Reading',
    techStack: [],
    
    validationCheckpoints: ['research', 'interviews'],
    keyQuestions: [
      { question: 'Is this problem worth solving?', answer: 'Many readers juggle multiple languages' },
      { question: 'Do people actually want this?' },
    ],
    nextAction: 'Complete 3 more user interviews',
    
    marketResearch: 'Goodreads dominates but lacks multilingual support. Storygraph is growing but English-focused.',
    userInterviewNotes: '2 interviews done - both excited about language mixing features',
  },
  {
    id: 'app_333',
    userId: 'user-1',
    appNameInternal: 'LyricsLeap',
    appNamePublished: 'LyricsLeap',
    slug: 'lyricsleap',
    status: 'published',
    
    usesBusinessDNA: false,
    businessId: '2',
    
    problemStatement: 'Language learners need engaging content to practice with.',
    solutionStatement: 'Learn languages through music lyrics with interactive translations.',
    description: 'Language learning through music',
    
    tasks: [
      { id: 't1', title: 'Launch marketing', status: 'done', priority: 'high' },
      { id: 't2', title: 'Monitor user feedback', status: 'in_progress', priority: 'medium' },
    ],
    
    enabledFeatures: [
      { id: 'f1', featureName: 'Lyrics Database', enabled: true },
      { id: 'f2', featureName: 'Translation', enabled: true },
      { id: 'f3', featureName: 'Audio Sync', enabled: true },
    ],
    
    links: [
      { id: 'l1', title: 'Live Site', url: 'https://lyricsleap.com', createdAt: '2026-01-10T08:00:00Z' },
    ],
    
    hasStaging: true,
    stagingUrl: 'https://staging.lyricsleap.com',
    
    isFocused: false,
    
    phase: 'Published',
    progress: 100,
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2026-02-21T10:00:00Z',
    tags: ['education', 'music', 'languages'],
    healthScore: 88,
    category: 'Education',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    
    validationCheckpoints: ['polish', 'marketing', 'launch'],
  },
  {
    id: 'app_444',
    userId: 'user-1',
    appNameInternal: 'Spanish Grammar Palace',
    appNamePublished: 'Spanish Grammar Palace',
    slug: 'spanish-grammar-palace',
    status: 'brainstorming',
    
    usesBusinessDNA: false,
    businessId: '3',
    
    problemStatement: 'Spanish grammar is complex and intimidating for beginners.',
    description: 'Interactive Spanish grammar learning',
    
    tasks: [],
    enabledFeatures: [],
    links: [],
    
    hasStaging: false,
    isFocused: false,
    
    phase: 'Brainstorming',
    progress: 15,
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-18T12:00:00Z',
    tags: ['spanish', 'grammar', 'education'],
    healthScore: 60,
    category: 'Education',
    techStack: [],
    
    validationCheckpoints: [],
  },
  {
    id: 'app_555',
    userId: 'user-1',
    appNameInternal: 'Spanish Verb Engine',
    appNamePublished: 'Spanish Verb Engine',
    slug: 'spanish-verb-engine',
    status: 'brainstorming',
    
    usesBusinessDNA: false,
    businessId: '3',
    
    problemStatement: 'Spanish verb conjugation is overwhelming to learn.',
    description: 'Master Spanish verb conjugations',
    
    tasks: [],
    enabledFeatures: [],
    links: [],
    
    hasStaging: false,
    isFocused: false,
    
    phase: 'Brainstorming',
    progress: 10,
    createdAt: '2026-02-12T08:00:00Z',
    updatedAt: '2026-02-16T14:00:00Z',
    tags: ['spanish', 'verbs', 'education'],
    healthScore: 55,
    category: 'Education',
    techStack: [],
    
    validationCheckpoints: [],
  },
  {
    id: 'app_archived_1',
    userId: 'user-1',
    appNameInternal: 'Civic Pet',
    appNamePublished: 'Civic Pet',
    slug: 'civic-pet',
    status: 'archived',
    
    usesBusinessDNA: false,
    businessId: '2',
    
    description: 'Local government engagement gamified',
    
    tasks: [],
    enabledFeatures: [],
    links: [],
    
    hasStaging: false,
    isFocused: false,
    
    phase: 'Archived',
    progress: 20,
    createdAt: '2025-09-01T08:00:00Z',
    updatedAt: '2025-12-15T10:00:00Z',
    tags: ['civic', 'gamification'],
    healthScore: 30,
    category: 'Civic Engagement',
    techStack: [],
    
    validationCheckpoints: [],
  },
];

// DNA Profiles
export const mockDNAProfiles: BusinessDNAProfile[] = [
  {
    id: 'dna_ent_456',
    userId: 'user-1',
    profileName: 'Enterprise DNA',
    slug: 'enterprise-dna',
    businessHubId: '1',
    description: 'Formal tone and cooler palette for B2B-facing products.',
    isActive: true,
    brandVoiceOverride: 'professional',
    brandVoiceCustomOverride: 'Confident and knowledgeable — like a trusted consultant.',
    targetAudienceOverride: 'SaaS teams and startup CTOs looking for reliable tooling.',
    messagingPillarsOverride: [
      { pillar: 'Reliability', description: 'Enterprise-grade uptime and support.' },
      { pillar: 'Integration', description: 'Fits into your existing stack seamlessly.' },
    ],
    primaryColor: '#2563EB',
    secondaryColor: '#0F172A',
    accentColor: '#F59E0B',
    additionalNotes: 'Use this profile for any B2B or developer-facing apps.',
    createdAt: '2025-12-10T09:00:00Z',
    updatedAt: '2026-02-18T11:00:00Z',
  },
];
