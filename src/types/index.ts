import { type AppStatus } from '../lib/design-tokens';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
}

// Business DNA Types
export interface BusinessDNA {
  id: string;
  name: string;
  description: string;
  category: string;
  mission: string;
  vision: string;
  values: string[];
  targetAudience: string;
  brandVoice: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typography: {
    headline: string;
    body: string;
  };
  imagery: string;
  createdAt: Date;
  updatedAt: Date;
}

// App Concept Types
export interface AppConcept {
  id: string;
  name: string;
  description: string;
  status: AppStatus;
  category: string;
  businessId?: string;
  healthScore: number;
  phase: 'define' | 'build' | 'tech';
  mainPrompt: string;
  features: Feature[];
  links: Link[];
  techStack: string[];
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Link {
  id: string;
  type: 'app' | 'social' | 'doc' | 'other';
  label: string;
  url: string;
  icon?: string;
}

// Asset Types
export interface Asset {
  id: string;
  type: 'image' | 'prompt' | 'note' | 'document';
  name: string;
  description: string;
  url?: string;
  thumbnailUrl?: string;
  content?: string;
  tags: string[];
  assignedToAppId?: string;
  assignedToBusinessId?: string;
  metadata: {
    width?: number;
    height?: number;
    fileSize?: number;
    mimeType?: string;
    extractedText?: string;
  };
  status: 'inbox' | 'processed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedToAppId?: string;
  assignedToBusinessId?: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Types
export interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'status-change' | 'comment';
  entityType: 'app' | 'business' | 'asset' | 'task';
  entityId: string;
  entityName: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

// Health Metrics Types
export interface HealthMetrics {
  overall: number;
  documentation: number;
  features: number;
  technical: number;
  branding: number;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  phase?: 'create' | 'develop' | 'manage' | 'output' | 'system';
  badge?: string | number;
}

export interface NavigationGroup {
  id: string;
  label: string;
  phase: 'create' | 'develop' | 'manage' | 'output' | 'system';
  items: NavigationItem[];
}

// Filter Types
export interface FilterState {
  search: string;
  status: AppStatus[];
  category: string[];
  businessId: string[];
  sortBy: 'name' | 'date' | 'health' | 'status';
  sortDirection: 'asc' | 'desc';
}
