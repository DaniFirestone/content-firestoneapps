import {
  type User,
  type BusinessDNA,
  type AppConcept,
  type Asset,
  type Task,
  type Activity,
} from '../types';

// Mock User
export const mockUser: User = {
  id: 'user-1',
  email: 'alex@contenthub.com',
  name: 'Alex Rivera',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'admin',
};

// Mock Businesses
export const mockBusinesses: BusinessDNA[] = [
  {
    id: 'biz-1',
    name: 'TechVision Labs',
    description: 'Innovative software solutions for modern businesses',
    category: 'Software & Technology',
    mission: 'Empowering businesses through cutting-edge technology',
    vision: 'A world where technology seamlessly enhances every aspect of business',
    values: ['Innovation', 'Quality', 'Customer Success', 'Collaboration'],
    targetAudience: 'Mid-size to enterprise B2B companies',
    brandVoice: 'Professional yet approachable, innovative and forward-thinking',
    primaryColor: '#3F51B5',
    secondaryColor: '#009688',
    accentColor: '#E9C46A',
    typography: {
      headline: 'EB Garamond',
      body: 'Lato',
    },
    imagery: 'Clean, modern, tech-focused with human elements',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'biz-2',
    name: 'GreenLeaf Organics',
    description: 'Sustainable organic products for health-conscious consumers',
    category: 'Food & Wellness',
    mission: 'Bringing pure, organic nutrition to every table',
    vision: 'A healthier planet through sustainable organic practices',
    values: ['Sustainability', 'Purity', 'Wellness', 'Transparency'],
    targetAudience: 'Health-conscious consumers, ages 25-45',
    brandVoice: 'Warm, authentic, nurturing, and educational',
    primaryColor: '#2A9D8F',
    secondaryColor: '#E9C46A',
    accentColor: '#F4A261',
    typography: {
      headline: 'EB Garamond',
      body: 'Lato',
    },
    imagery: 'Natural, organic, earth tones, fresh produce',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-21'),
  },
];

// Mock App Concepts
export const mockAppConcepts: AppConcept[] = [
  {
    id: 'app-1',
    name: 'ProjectHub Pro',
    description: 'Advanced project management and collaboration platform',
    status: 'prototyping',
    category: 'Productivity',
    businessId: 'biz-1',
    healthScore: 87,
    phase: 'build',
    mainPrompt:
      'A comprehensive project management tool with real-time collaboration, Gantt charts, resource allocation, and AI-powered task recommendations.',
    features: [
      {
        id: 'feat-1',
        name: 'Real-time Collaboration',
        description: 'Live updates and team chat',
        enabled: true,
        priority: 'high',
      },
      {
        id: 'feat-2',
        name: 'Gantt Charts',
        description: 'Visual project timeline',
        enabled: true,
        priority: 'high',
      },
      {
        id: 'feat-3',
        name: 'AI Task Recommendations',
        description: 'Smart task prioritization',
        enabled: false,
        priority: 'medium',
      },
      {
        id: 'feat-4',
        name: 'Resource Allocation',
        description: 'Team capacity planning',
        enabled: true,
        priority: 'medium',
      },
    ],
    links: [
      {
        id: 'link-1',
        type: 'app',
        label: 'Dev Preview',
        url: 'https://projecthub-dev.example.com',
      },
      {
        id: 'link-2',
        type: 'doc',
        label: 'Figma Design',
        url: 'https://figma.com/file/example',
      },
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-18'),
    lastActivityAt: new Date('2024-02-20'),
  },
  {
    id: 'app-2',
    name: 'Wellness Tracker',
    description: 'Personal health and wellness tracking application',
    status: 'idea',
    category: 'Health & Fitness',
    businessId: 'biz-2',
    healthScore: 45,
    phase: 'define',
    mainPrompt:
      'A holistic wellness tracker that monitors nutrition, exercise, sleep, and mental health with personalized insights and recommendations.',
    features: [
      {
        id: 'feat-5',
        name: 'Nutrition Logging',
        description: 'Track meals and calories',
        enabled: true,
        priority: 'high',
      },
      {
        id: 'feat-6',
        name: 'Exercise Tracking',
        description: 'Log workouts and activities',
        enabled: true,
        priority: 'high',
      },
      {
        id: 'feat-7',
        name: 'Sleep Analysis',
        description: 'Monitor sleep patterns',
        enabled: false,
        priority: 'medium',
      },
    ],
    links: [],
    techStack: ['React Native', 'Firebase', 'HealthKit', 'Google Fit'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-19'),
    lastActivityAt: new Date('2024-02-19'),
  },
  {
    id: 'app-3',
    name: 'CodeSnippet Manager',
    description: 'Organize and share code snippets with your team',
    status: 'brainstorming',
    category: 'Developer Tools',
    businessId: 'biz-1',
    healthScore: 62,
    phase: 'define',
    mainPrompt:
      'A developer-focused app for saving, organizing, and sharing code snippets with syntax highlighting, tags, and team collaboration.',
    features: [
      {
        id: 'feat-8',
        name: 'Syntax Highlighting',
        description: 'Multi-language support',
        enabled: true,
        priority: 'high',
      },
      {
        id: 'feat-9',
        name: 'Tag Organization',
        description: 'Categorize snippets',
        enabled: true,
        priority: 'medium',
      },
    ],
    links: [],
    techStack: ['Vue.js', 'MongoDB', 'Prism.js'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-17'),
    lastActivityAt: new Date('2024-02-17'),
  },
  {
    id: 'app-4',
    name: 'RecipeBox',
    description: 'Digital cookbook with meal planning features',
    status: 'published',
    category: 'Food & Cooking',
    businessId: 'biz-2',
    healthScore: 94,
    phase: 'tech',
    mainPrompt:
      'A beautiful recipe management app with meal planning, shopping lists, and nutritional information.',
    features: [
      {
        id: 'feat-10',
        name: 'Recipe Storage',
        description: 'Save and organize recipes',
        enabled: true,
        priority: 'high',
      },
      {
        id: 'feat-11',
        name: 'Meal Planner',
        description: 'Weekly meal planning',
        enabled: true,
        priority: 'high',
      },
      {
        id: 'feat-12',
        name: 'Shopping Lists',
        description: 'Auto-generated lists',
        enabled: true,
        priority: 'high',
      },
      {
        id: 'feat-13',
        name: 'Nutrition Facts',
        description: 'Detailed nutritional info',
        enabled: true,
        priority: 'medium',
      },
    ],
    links: [
      {
        id: 'link-3',
        type: 'app',
        label: 'Live App',
        url: 'https://recipebox.example.com',
      },
    ],
    techStack: ['Next.js', 'Tailwind CSS', 'Supabase', 'Vercel'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-02-21'),
    lastActivityAt: new Date('2024-02-21'),
  },
  {
    id: 'app-5',
    name: 'InvoiceGen',
    description: 'Simple invoicing for freelancers',
    status: 'archived',
    category: 'Business Tools',
    healthScore: 0,
    phase: 'define',
    mainPrompt: 'Basic invoicing tool for freelancers and small businesses.',
    features: [],
    links: [],
    techStack: [],
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2024-01-05'),
    lastActivityAt: new Date('2024-01-05'),
  },
];

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    type: 'image',
    name: 'Hero Background',
    description: 'Main hero section background image',
    url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
    tags: ['hero', 'background', 'gradient'],
    assignedToAppId: 'app-1',
    metadata: {
      width: 1920,
      height: 1080,
      fileSize: 245680,
      mimeType: 'image/jpeg',
    },
    status: 'processed',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'asset-2',
    type: 'prompt',
    name: 'AI Task Suggestion Prompt',
    description: 'Prompt for generating task recommendations',
    content:
      'Analyze the project timeline and team capacity. Suggest the next 3 most important tasks based on dependencies, deadlines, and available resources. Format the response as: 1. Task name (reason), 2. Task name (reason), 3. Task name (reason).',
    tags: ['ai', 'prompt', 'tasks'],
    assignedToAppId: 'app-1',
    metadata: {},
    status: 'processed',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
  },
  {
    id: 'asset-3',
    type: 'image',
    name: 'Organic Produce Photo',
    description: 'Fresh vegetables for homepage',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    tags: ['food', 'organic', 'vegetables'],
    assignedToAppId: 'app-4',
    assignedToBusinessId: 'biz-2',
    metadata: {
      width: 1600,
      height: 1200,
      fileSize: 189340,
      mimeType: 'image/jpeg',
    },
    status: 'processed',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'asset-4',
    type: 'note',
    name: 'Feature Ideas Brainstorm',
    description: 'Initial feature brainstorming notes',
    content:
      '- Add dark mode\n- Implement offline sync\n- Add export to PDF\n- Team analytics dashboard\n- Integration with Slack\n- Mobile app version',
    tags: ['brainstorm', 'features', 'ideas'],
    status: 'inbox',
    metadata: {},
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-18'),
  },
  {
    id: 'asset-5',
    type: 'image',
    name: 'UI Mockup',
    description: 'Dashboard design mockup',
    url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
    tags: ['design', 'mockup', 'dashboard'],
    status: 'inbox',
    metadata: {
      width: 1400,
      height: 900,
      fileSize: 156780,
      mimeType: 'image/jpeg',
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication with refresh tokens',
    status: 'in-progress',
    priority: 'high',
    assignedToAppId: 'app-1',
    dueDate: new Date('2024-02-25'),
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-18'),
  },
  {
    id: 'task-2',
    title: 'Design database schema',
    description: 'Create ERD and SQL migrations for core tables',
    status: 'done',
    priority: 'high',
    assignedToAppId: 'app-1',
    completedAt: new Date('2024-02-15'),
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'task-3',
    title: 'Create brand style guide',
    description: 'Document all brand colors, fonts, and voice guidelines',
    status: 'todo',
    priority: 'medium',
    assignedToBusinessId: 'biz-2',
    dueDate: new Date('2024-02-28'),
    createdAt: new Date('2024-02-16'),
    updatedAt: new Date('2024-02-16'),
  },
  {
    id: 'task-4',
    title: 'Add recipe import from URL',
    description: 'Allow users to import recipes by pasting a URL',
    status: 'todo',
    priority: 'low',
    assignedToAppId: 'app-4',
    createdAt: new Date('2024-02-19'),
    updatedAt: new Date('2024-02-19'),
  },
  {
    id: 'task-5',
    title: 'Optimize image loading',
    description: 'Implement lazy loading and WebP format',
    status: 'in-progress',
    priority: 'medium',
    assignedToAppId: 'app-4',
    dueDate: new Date('2024-02-23'),
    createdAt: new Date('2024-02-17'),
    updatedAt: new Date('2024-02-20'),
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'status-change',
    entityType: 'app',
    entityId: 'app-1',
    entityName: 'ProjectHub Pro',
    description: 'Changed status from "brainstorming" to "prototyping"',
    userId: 'user-1',
    userName: 'Alex Rivera',
    createdAt: new Date('2024-02-20T14:30:00'),
  },
  {
    id: 'act-2',
    type: 'update',
    entityType: 'app',
    entityId: 'app-1',
    entityName: 'ProjectHub Pro',
    description: 'Updated main prompt and added AI features',
    userId: 'user-1',
    userName: 'Alex Rivera',
    createdAt: new Date('2024-02-20T10:15:00'),
  },
  {
    id: 'act-3',
    type: 'create',
    entityType: 'task',
    entityId: 'task-5',
    entityName: 'Optimize image loading',
    description: 'Created new task',
    userId: 'user-1',
    userName: 'Alex Rivera',
    createdAt: new Date('2024-02-19T16:45:00'),
  },
  {
    id: 'act-4',
    type: 'create',
    entityType: 'asset',
    entityId: 'asset-3',
    entityName: 'Organic Produce Photo',
    description: 'Uploaded new asset',
    userId: 'user-1',
    userName: 'Alex Rivera',
    createdAt: new Date('2024-02-18T11:20:00'),
  },
  {
    id: 'act-5',
    type: 'update',
    entityType: 'business',
    entityId: 'biz-2',
    entityName: 'GreenLeaf Organics',
    description: 'Updated brand voice and imagery guidelines',
    userId: 'user-1',
    userName: 'Alex Rivera',
    createdAt: new Date('2024-02-17T09:00:00'),
  },
];

// Helper functions to get mock data
export function getBusinessById(id: string): BusinessDNA | undefined {
  return mockBusinesses.find((b) => b.id === id);
}

export function getAppById(id: string): AppConcept | undefined {
  return mockAppConcepts.find((a) => a.id === id);
}

export function getAssetById(id: string): Asset | undefined {
  return mockAssets.find((a) => a.id === id);
}

export function getTaskById(id: string): Task | undefined {
  return mockTasks.find((t) => t.id === id);
}

export function getAppsByBusinessId(businessId: string): AppConcept[] {
  return mockAppConcepts.filter((a) => a.businessId === businessId);
}

export function getAssetsByAppId(appId: string): Asset[] {
  return mockAssets.filter((a) => a.assignedToAppId === appId);
}

export function getTasksByAppId(appId: string): Task[] {
  return mockTasks.filter((t) => t.assignedToAppId === appId);
}

export function getRecentActivities(limit: number = 10): Activity[] {
  return mockActivities.slice(0, limit);
}
