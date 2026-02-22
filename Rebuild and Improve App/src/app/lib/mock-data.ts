import type { ColorRGB, ColorHSL, ColorAccessibility, FigmaColor } from './color-utils';
import { mockFirestoneApps } from './mock-apps-new';

// Mock data for the Content Hub application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface MessagingPillar {
  pillar: string;
  description: string;
}

export interface ColorInfo {
  hex: string;
  usage: string;
  // Enhanced metadata for Figma integration
  rgb?: ColorRGB;
  hsl?: ColorHSL;
  figma?: FigmaColor;
  accessibility?: ColorAccessibility;
  tokenName?: string; // Figma-compatible token name
}

export interface CustomColor {
  name: string;
  hex: string;
  usage: string;
}

export interface ColorPalette {
  primary: ColorInfo;
  secondary: ColorInfo;
  accent: ColorInfo;
  background: ColorInfo;
  customColors?: CustomColor[];
}

export interface FontInfo {
  font: string;
  whyItWorks: string;
  usage: string[];
}

export interface Typography {
  primaryFont: FontInfo;
  secondaryFont: FontInfo;
  fontNotes?: string;
}

export interface LogoVariant {
  url: string;
  variant: string;
  usage: string;
}

export interface StyleguideSource {
  originalContent?: string;
  parsingMetadata?: {
    parsedAt: string;
    sourceType: string;
    aiModel?: string;
    parsingStatus: string;
  };
}

export interface BusinessDNAProfile {
  id: string;
  userId: string;
  profileName: string;
  slug: string;
  businessHubId: string;
  description: string;
  isActive: boolean;
  brandVoiceOverride?: string;
  brandVoiceCustomOverride?: string;
  targetAudienceOverride?: string;
  messagingPillarsOverride?: MessagingPillar[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  userId: string;
  companyName: string;
  slug: string;
  tagline: string;
  description?: string;
  missionStatement?: string;
  industry?: string;
  category?: string;
  status: 'active' | 'draft' | 'archived';
  
  // Brand Voice & Messaging
  brandVoice?: string;
  brandVoiceCustom?: string;
  brandPersonality?: string[];
  messagingPillars?: MessagingPillar[];
  
  // Target Audience
  targetAudience?: string;
  uniqueSellingProposition?: string;
  
  // Visual Identity
  colorPalette?: ColorPalette;
  typography?: Typography;
  logoUrls?: LogoVariant[];
  imagery?: string;
  
  // Source
  styleguideSource?: StyleguideSource;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface AppTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done' | 'parked';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface AppFeature {
  id: string;
  featureName: string;
  enabled: boolean;
  enabledAt?: string;
  notes?: string;
  excluded?: boolean;
}

export interface AppLink {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface SessionState {
  lastActiveAt: string;
  lastActiveTab?: string;
  lastTaskInProgress?: string;
  contextSnapshot?: {
    tasksCompleted: number;
    tasksInProgress: number;
    healthScore: number;
    recentActivity: string;
  };
  userNote?: string;
  aiSummary?: string;
}

export interface AppConcept {
  id: string;
  userId: string;
  appNameInternal: string;
  appNamePublished?: string;
  chromeProfile?: string;
  slug: string;
  status: 'idea' | 'brainstorming' | 'prototyping' | 'final' | 'published' | 'archived';
  
  // DNA Integration
  usesBusinessDNA: boolean;
  businessDNAId?: string;
  
  // Core Details
  problemStatement?: string;
  solutionStatement?: string;
  description: string;
  longDescription?: string;
  appSpecificUSP?: string;
  
  // Visual Identity (can override DNA)
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  
  // Tasks & Features
  tasks: AppTask[];
  enabledFeatures: AppFeature[];
  links: AppLink[];
  
  // Firebase/Deployment
  hasStaging: boolean;
  stagingUrl?: string;
  developmentUrl?: string;
  firebaseStudioLink?: string;
  firebaseConsoleLink?: string;
  googleCloudProjectId?: string;
  googleCloudProjectName?: string;
  
  // Session & Focus
  isFocused: boolean;
  lastSessionContext?: string;
  sessionState?: SessionState;
  
  // Legacy/Additional Fields
  phase: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  thumbnail?: string;
  businessId?: string;
  healthScore?: number;
  mainPrompt?: string;
  category?: string;
  techStack?: string[];
  
  // Stage-based workflow fields
  validationCheckpoints?: string[];
  keyQuestions?: { question: string; answer?: string }[];
  nextAction?: string;
  
  // Additional validation fields
  targetUser?: string;
  solutionDescription?: string;
  marketResearch?: string;
  userInterviewNotes?: string;
  demandEvidence?: string;
  mvpScope?: string;
  techStackRationale?: string;
  prototypeUrl?: string;
  userFeedback?: string;
  uxPolishNotes?: string;
  marketingPlan?: string;
  launchStrategy?: string;
  
  // Assets
  prototypeAssetIds?: string[];
  processIds?: string[];
}

export interface PrototypeAsset {
  id: string;
  userId: string;
  title: string;
  assetUrl: string;
  assetType: 'image' | 'video' | 'document' | 'audio' | 'code';
  appId?: string;
  businessId?: string;
  description?: string;
  tags: string[];
  processingStatus: 'pending' | 'processing' | 'ready' | 'failed';
  aiAnalysis?: {
    analyzedAt: string;
    visualElements: string[];
    dominantColors: string[];
    suggestedUseCases: string[];
    composition?: string;
    styleCharacteristics?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'code';
  category: string;
  size: string;
  url: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  aiGenerated?: boolean;
  assignedToAppId?: string;
  uploadedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: string;
  relatedApp?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUser: User = {
  id: 'user-1',
  email: 'alex@contenthub.com',
  name: 'Alex Rivera',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'admin',
};

export const mockAppConcepts: AppConcept[] = [
  {
    id: '1',
    userId: 'user-1',
    appNameInternal: 'Task Master Pro',
    description: 'A comprehensive task management application with AI-powered prioritization',
    status: 'prototyping',
    phase: 'Prototyping',
    progress: 65,
    createdAt: '2026-01-15',
    updatedAt: '2026-02-20',
    tags: ['productivity', 'ai', 'task-management'],
    businessId: '1',
    healthScore: 85,
    mainPrompt: 'Create a task management app with AI prioritization',
    category: 'Productivity',
    usesBusinessDNA: false,
    hasStaging: true,
    isFocused: false,
    tasks: [],
    enabledFeatures: [
      { id: '1', featureName: 'AI Prioritization', enabled: true, notes: 'Automatically prioritize tasks based on importance and urgency' },
      { id: '2', featureName: 'Task Assignment', enabled: true, notes: 'Assign tasks to team members' },
      { id: '3', featureName: 'Notifications', enabled: true, notes: 'Receive notifications for upcoming deadlines' },
    ],
    links: [
      { id: '1', url: 'https://www.figma.com/file/...', title: 'Design', createdAt: '2026-01-15' },
      { id: '2', url: 'https://github.com/...', title: 'Repository', createdAt: '2026-01-15' },
      { id: '3', url: 'https://docs.google.com/...', title: 'Documentation', createdAt: '2026-01-16' },
      { id: '4', url: 'https://staging.taskmasterpro.com', title: 'Staging', createdAt: '2026-02-01' },
      { id: '5', url: 'https://taskmasterpro.com', title: 'Live', createdAt: '2026-02-15' },
    ],
    techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
    validationCheckpoints: ['mvp', 'tech', 'prototype'],
    keyQuestions: [
      { question: 'What\'s the minimum viable version?', answer: 'Core task creation, AI prioritization, basic notifications' },
      { question: 'How will I build this?', answer: 'React frontend, Node.js backend, OpenAI for prioritization' },
      { question: 'Will people actually use it?', answer: 'Testing with 5 beta users, positive initial feedback' },
    ],
    nextAction: 'Collect feedback from beta users on prototype',
  },
  {
    id: '2',
    userId: 'user-1',
    appNameInternal: 'Fitness Tracker',
    description: 'Personal fitness and wellness tracking application',
    status: 'final',
    phase: 'Final',
    progress: 85,
    createdAt: '2026-01-10',
    updatedAt: '2026-02-19',
    tags: ['health', 'fitness', 'wellness'],
    businessId: '1',
    healthScore: 90,
    mainPrompt: 'Create a fitness tracking app with wellness features',
    category: 'Health & Wellness',
    usesBusinessDNA: false,
    hasStaging: true,
    isFocused: false,
    tasks: [],
    enabledFeatures: [
      { id: '1', featureName: 'Step Tracking', enabled: true, notes: 'Track daily steps and activity levels' },
      { id: '2', featureName: 'Nutrition Tracking', enabled: true, notes: 'Log and analyze daily nutrition intake' },
      { id: '3', featureName: 'Mental Health', enabled: true, notes: 'Include mental health tracking and resources' },
    ],
    links: [
      { id: '1', url: 'https://www.figma.com/file/...', title: 'Design', createdAt: '2026-01-10' },
      { id: '2', url: 'https://github.com/...', title: 'Repository', createdAt: '2026-01-10' },
      { id: '3', url: 'https://docs.google.com/...', title: 'Documentation', createdAt: '2026-01-11' },
      { id: '4', url: 'https://staging.fitnesstracker.com', title: 'Staging', createdAt: '2026-01-20' },
      { id: '5', url: 'https://fitnesstracker.com', title: 'Live', createdAt: '2026-02-10' },
    ],
    techStack: ['React Native', 'Firebase', 'Google Fit API'],
    validationCheckpoints: ['polish', 'marketing'],
    keyQuestions: [
      { question: 'Is this ready to launch?', answer: 'Almost - need to finish marketing materials' },
      { question: 'How will I get users?', answer: 'Product Hunt launch, fitness subreddits, Instagram ads' },
      { question: 'What\'s my launch plan?' },
    ],
    nextAction: 'Finalize App Store screenshots and prepare Product Hunt launch',
  },
  {
    id: '3',
    userId: 'user-1',
    appNameInternal: 'Budget Buddy',
    description: 'Smart personal finance and budgeting tool',
    status: 'brainstorming',
    phase: 'Brainstorming',
    progress: 30,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-18',
    tags: ['finance', 'budgeting', 'personal'],
    businessId: '1',
    healthScore: 70,
    mainPrompt: 'Create a budgeting app with financial insights',
    category: 'Finance',
    usesBusinessDNA: false,
    hasStaging: false,
    isFocused: false,
    tasks: [],
    enabledFeatures: [
      { id: '1', featureName: 'Expense Tracking', enabled: true, notes: 'Track and categorize expenses' },
      { id: '2', featureName: 'Budget Alerts', enabled: true, notes: 'Receive alerts when approaching budget limits' },
      { id: '3', featureName: 'Investment Insights', enabled: false, notes: 'Provide investment tips and insights' },
    ],
    links: [
      { id: '1', url: 'https://www.figma.com/file/...', title: 'Design', createdAt: '2026-02-01' },
      { id: '2', url: 'https://github.com/...', title: 'Repository', createdAt: '2026-02-01' },
    ],
    techStack: [],
    validationCheckpoints: ['research'],
    keyQuestions: [
      { question: 'Is this problem worth solving?', answer: '73% of survey respondents struggle with budgeting' },
      { question: 'Do people actually want this?', answer: 'Need to interview 5 more users' },
      { question: 'What makes this different?', answer: 'Focus on AI-powered insights vs just tracking' },
    ],
    nextAction: 'Schedule 5 user interviews with target demographic',
  },
  {
    id: '4',
    userId: 'user-1',
    appNameInternal: 'Recipe Vault',
    description: 'Digital cookbook with meal planning and grocery lists',
    status: 'idea',
    phase: 'Idea',
    progress: 10,
    createdAt: '2026-02-10',
    updatedAt: '2026-02-15',
    tags: ['food', 'cooking', 'lifestyle'],
    businessId: '2',
    healthScore: 60,
    mainPrompt: 'Create a digital cookbook with meal planning',
    category: 'Food & Cooking',
    usesBusinessDNA: false,
    hasStaging: false,
    isFocused: false,
    tasks: [],
    enabledFeatures: [],
    links: [],
    techStack: [],
    validationCheckpoints: ['problem'],
    keyQuestions: [
      { question: 'What problem does this solve?', answer: 'People lose recipes and struggle with meal planning' },
      { question: 'Who has this problem?', answer: 'Home cooks, meal preppers, busy families' },
      { question: 'Why now?' },
    ],
    nextAction: 'Research existing recipe apps and identify differentiation opportunity',
  },
  {
    id: '5',
    userId: 'user-1',
    appNameInternal: 'Study Companion',
    description: 'Educational app with flashcards and spaced repetition',
    status: 'published',
    phase: 'Published',
    progress: 100,
    createdAt: '2025-12-01',
    updatedAt: '2026-02-21',
    tags: ['education', 'learning', 'study'],
    businessId: '1',
    healthScore: 95,
    mainPrompt: 'Create an educational app with flashcards and spaced repetition',
    category: 'Education',
    usesBusinessDNA: false,
    hasStaging: true,
    isFocused: false,
    tasks: [],
    enabledFeatures: [
      { id: '1', featureName: 'Flashcards', enabled: true, notes: 'Create and study flashcards' },
      { id: '2', featureName: 'Spaced Repetition', enabled: true, notes: 'Use spaced repetition to reinforce learning' },
      { id: '3', featureName: 'Progress Tracking', enabled: true, notes: 'Track progress and performance' },
    ],
    links: [
      { id: '1', url: 'https://www.figma.com/file/...', title: 'Design', createdAt: '2025-12-01' },
      { id: '2', url: 'https://github.com/...', title: 'Repository', createdAt: '2025-12-01' },
      { id: '3', url: 'https://docs.google.com/...', title: 'Documentation', createdAt: '2025-12-05' },
      { id: '4', url: 'https://staging.studycoppanion.com', title: 'Staging', createdAt: '2025-12-20' },
      { id: '5', url: 'https://studycoppanion.com', title: 'Live', createdAt: '2026-01-15' },
    ],
    techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
    validationCheckpoints: ['polish', 'marketing', 'launch'],
  },
];

export const mockBusinesses: Business[] = [
  {
    id: '1',
    userId: 'user-1',
    companyName: 'Firestone Creative',
    slug: 'firestone-creative',
    tagline: 'Build bold. Ship fast.',
    description: 'Empowering solo creators to launch polished digital products without a team.',
    missionStatement: 'Empowering solo creators to launch polished digital products without a team.',
    industry: 'Technology',
    category: 'Software',
    status: 'active',
    
    brandVoice: 'friendly',
    brandVoiceCustom: 'Warm but direct — like a smart friend who skips the fluff.',
    brandPersonality: ['innovative', 'approachable', 'bold', 'resourceful'],
    messagingPillars: [
      { pillar: 'Simplicity', description: 'Strip away complexity so creators can focus on what matters.' },
      { pillar: 'Speed', description: 'From idea to launch in days, not months.' },
      { pillar: 'Ownership', description: 'You own your brand, your data, your destiny.' },
    ],
    
    targetAudience: 'Solo founders, indie hackers, and creative freelancers aged 25-40 who want to ship side projects.',
    uniqueSellingProposition: 'The only platform that connects your brand DNA to every app you build — automatically.',
    
    colorPalette: {
      primary: { hex: '#6C3CE1', usage: 'Buttons, links, primary actions' },
      secondary: { hex: '#1A1A2E', usage: 'Headings, dark backgrounds' },
      accent: { hex: '#F5A623', usage: 'Highlights, badges, alerts' },
      background: { hex: '#FAFAFA', usage: 'Page backgrounds, cards' },
      customColors: [
        { name: 'Success Green', hex: '#34D399', usage: 'Success states, confirmations' },
        { name: 'Error Red', hex: '#EF4444', usage: 'Error states, destructive actions' },
      ],
    },
    
    typography: {
      primaryFont: {
        font: 'EB Garamond',
        whyItWorks: 'Classic serif that adds warmth and gravitas to headlines.',
        usage: ['Headlines', 'Hero text', 'Pull quotes'],
      },
      secondaryFont: {
        font: 'Lato',
        whyItWorks: 'Clean sans-serif that reads well at any size.',
        usage: ['Body text', 'UI labels', 'Navigation'],
      },
      fontNotes: 'Use EB Garamond at 600+ weight for headlines. Lato at 400 for body, 700 for emphasis.',
    },
    
    logoUrls: [
      { url: 'https://storage.example.com/logos/firestone-full.svg', variant: 'Full color', usage: 'Light backgrounds' },
      { url: 'https://storage.example.com/logos/firestone-mono.svg', variant: 'Monochrome', usage: 'Dark backgrounds, favicons' },
    ],
    
    imagery: 'Modern, energetic visuals with clean layouts. Use vibrant gradients, bold typography, and authentic creator photography.',
    
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
  },
  {
    id: '2',
    userId: 'user-1',
    companyName: 'Emotionless Robot Art',
    slug: 'emotionless-robot-art',
    tagline: 'Culture and Language!!!',
    status: 'active',
    
    colorPalette: {
      primary: { hex: '#3D3027', usage: 'Primary elements' },
      secondary: { hex: '#E46C79', usage: 'Accent elements' },
      accent: { hex: '#E46C79', usage: 'Highlights' },
      background: { hex: '#F5E6D3', usage: 'Backgrounds' },
    },
    
    createdAt: '2025-12-15T08:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: '3',
    userId: 'user-1',
    companyName: 'Firestone Strategic Solutions',
    slug: 'firestone-strategic-solutions',
    tagline: 'Navigate Your Success',
    status: 'active',
    
    colorPalette: {
      primary: { hex: '#1E429F', usage: 'Primary elements' },
      secondary: { hex: '#0EA5E9', usage: 'Secondary elements' },
      accent: { hex: '#7DD3FC', usage: 'Highlights' },
      background: { hex: '#0F172A', usage: 'Backgrounds' },
    },
    
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z',
  },
];

export const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Hero Banner',
    type: 'image',
    category: 'Marketing',
    size: '2.4 MB',
    url: '/assets/hero-banner.png',
    tags: ['banner', 'hero', 'homepage'],
    createdAt: '2026-02-15',
    updatedAt: '2026-02-15',
    assignedToAppId: '1',
    uploadedAt: '2026-02-15',
  },
  {
    id: '2',
    name: 'Product Demo Video',
    type: 'video',
    category: 'Marketing',
    size: '45.8 MB',
    url: '/assets/demo-video.mp4',
    tags: ['demo', 'product', 'video'],
    createdAt: '2026-02-10',
    updatedAt: '2026-02-12',
    assignedToAppId: '1',
    uploadedAt: '2026-02-10',
  },
  {
    id: '3',
    name: 'Brand Guidelines',
    type: 'document',
    category: 'Branding',
    size: '1.2 MB',
    url: '/assets/brand-guidelines.pdf',
    tags: ['brand', 'guidelines', 'documentation'],
    createdAt: '2026-01-20',
    updatedAt: '2026-02-01',
    assignedToAppId: '1',
    uploadedAt: '2026-01-20',
  },
  {
    id: '4',
    name: 'AI Generated Logo',
    type: 'image',
    category: 'Branding',
    size: '384 KB',
    url: '/assets/ai-logo.svg',
    tags: ['logo', 'ai', 'branding'],
    createdAt: '2026-02-18',
    updatedAt: '2026-02-18',
    aiGenerated: true,
    assignedToAppId: '1',
    uploadedAt: '2026-02-18',
  },
  {
    id: '5',
    name: 'Podcast Episode 1',
    type: 'audio',
    category: 'Content',
    size: '28.5 MB',
    url: '/assets/podcast-ep1.mp3',
    tags: ['podcast', 'audio', 'content'],
    createdAt: '2026-02-05',
    updatedAt: '2026-02-05',
    assignedToAppId: '1',
    uploadedAt: '2026-02-05',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design landing page mockups',
    description: 'Create high-fidelity mockups for the new landing page',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Sarah Johnson',
    dueDate: '2026-02-25',
    relatedApp: 'Task Master Pro',
    createdAt: '2026-02-15',
    updatedAt: '2026-02-20',
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up authentication flow with OAuth and JWT',
    status: 'todo',
    priority: 'urgent',
    assignee: 'Mike Chen',
    dueDate: '2026-02-23',
    relatedApp: 'Task Master Pro',
    createdAt: '2026-02-18',
    updatedAt: '2026-02-18',
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all API endpoints and usage examples',
    status: 'review',
    priority: 'medium',
    assignee: 'Alex Rivera',
    dueDate: '2026-02-28',
    relatedApp: 'Fitness Tracker',
    createdAt: '2026-02-10',
    updatedAt: '2026-02-19',
  },
  {
    id: '4',
    title: 'User testing session',
    description: 'Conduct user testing with 10 participants',
    status: 'completed',
    priority: 'high',
    assignee: 'Emily Davis',
    dueDate: '2026-02-20',
    relatedApp: 'Budget Buddy',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-20',
  },
  {
    id: '5',
    title: 'Update brand colors',
    description: 'Apply new brand colors across all marketing materials',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-03-05',
    createdAt: '2026-02-19',
    updatedAt: '2026-02-19',
  },
];

// Helper functions to get related data
export function getTasksByAppId(appId: string): Task[] {
  return mockTasks.filter((t) => {
    const app = mockAppConcepts.find((a) => a.id === appId);
    return app && t.relatedApp === app.appNameInternal;
  });
}

export function getAppsByBusinessId(businessId: string) {
  return mockFirestoneApps.filter((a: any) => a.businessId === businessId);
}

export function getAssetsByAppId(appId: string): Asset[] {
  return mockAssets.filter((a) => a.assignedToAppId === appId);
}

export function getRecentActivities(limit: number = 10) {
  const userNames = ['Alex Rivera', 'Sarah Johnson', 'Mike Chen', 'Emily Davis'];
  const activities = [
    ...mockAppConcepts.map((app, i) => ({
      id: `activity-app-${app.id}`,
      type: 'app',
      title: app.appNameInternal,
      description: `App in ${app.phase} phase`,
      timestamp: app.updatedAt,
      userName: userNames[i % userNames.length],
      createdAt: new Date(app.updatedAt),
    })),
    ...mockTasks.map((task, i) => ({
      id: `activity-task-${task.id}`,
      type: 'task',
      title: task.title,
      description: `Task ${task.status}`,
      timestamp: task.updatedAt,
      userName: task.assignee ?? userNames[i % userNames.length],
      createdAt: new Date(task.updatedAt),
    })),
    ...mockAssets.map((asset, i) => ({
      id: `activity-asset-${asset.id}`,
      type: 'asset',
      title: asset.name,
      description: `Asset uploaded`,
      timestamp: asset.uploadedAt ?? asset.updatedAt,
      userName: userNames[i % userNames.length],
      createdAt: new Date(asset.uploadedAt ?? asset.updatedAt),
    })),
  ];

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function getPublishedApps(): AppConcept[] {
  return mockAppConcepts.filter((app) => app.phase === 'published');
}