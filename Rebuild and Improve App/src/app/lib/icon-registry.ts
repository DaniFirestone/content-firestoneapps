import {
  // Navigation & Core
  Home,
  Sparkles,
  PenTool,
  Layers,
  Wrench,
  Hammer,
  Rocket,
  
  // Stage Icons
  Lightbulb,
  Brain,
  CheckCircle2,
  
  // Actions
  Plus,
  Edit,
  Copy,
  Archive,
  Trash2,
  Pin,
  MoveRight,
  ArrowRight,
  Download,
  Upload,
  Share2,
  ExternalLink,
  
  // Status & Indicators
  Circle,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  
  // Content & Media
  FileText,
  Images,
  Palette,
  Database,
  
  // UI Elements
  Search,
  Filter,
  SortAsc,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  
  // User & Settings
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  
  // Special
  Undo2,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  type LucideIcon,
} from 'lucide-react';

/**
 * Master Icon Registry
 * Central source of truth for all icons used in the application.
 * Prevents duplication and ensures consistency across pages.
 */

// ========== NAVIGATION ==========
export const ICON_NAV = {
  HOME: Home,
  SPARKLES: Sparkles, // Quick Capture
  QUICK_CAPTURE: Home,
  APP_INCUBATOR: Lightbulb, // Incubating ideas/concepts
  WORKSPACE: Wrench, // Tools for building
  APP_HUB: Layers,
  ASSETS: FileText,
  HEALTH: Activity,
  EXPORT: Download,
  TASKS: CheckCircle2,
  SETTINGS: Settings,
  HELP: HelpCircle,
  AI_SPARKLE: Sparkles, // Reserved specifically for AI triggers
} as const;

// ========== STAGE ICONS ==========
export const ICON_STAGE = {
  IDEA: Lightbulb,
  BRAINSTORMING: Brain,
  PROTOTYPING: Layers,
  FINAL: CheckCircle2,
  VALIDATE: CheckCircle2,
  ARCHIVED: Archive,
} as const;

// ========== ACTIONS ==========
export const ICON_ACTION = {
  ADD: Plus,
  EDIT: Edit,
  COPY: Copy,
  DUPLICATE: Copy,
  ARCHIVE: Archive,
  DELETE: Trash2,
  PIN: Pin,
  MOVE: MoveRight,
  ADVANCE: ArrowRight,
  DOWNLOAD: Download,
  UPLOAD: Upload,
  SHARE: Share2,
  OPEN_EXTERNAL: ExternalLink,
  UNDO: Undo2,
} as const;

// ========== STATUS ==========
export const ICON_STATUS = {
  UNCHECKED: Circle,
  CHECKED: CheckCircle2,
  SUCCESS: CheckCircle,
  ERROR: AlertCircle,
  WARNING: AlertTriangle,
  INFO: Info,
  TRENDING_UP: TrendingUp,
  TRENDING_DOWN: TrendingDown,
  ACTIVE: Zap,
} as const;

// ========== CONTENT ==========
export const ICON_CONTENT = {
  TEXT: FileText,
  FILE: FileText,
  IMAGES: Images,
  PALETTE: Palette,
  DATABASE: Database,
} as const;

// ========== UI ==========
export const ICON_UI = {
  SEARCH: Search,
  FILTER: Filter,
  SORT: SortAsc,
  MORE: MoreVertical,
  EXPAND: ChevronDown,
  CHEVRON_RIGHT: ChevronRight,
  COLLAPSE: ChevronRight,
  BACK: ChevronLeft,
  CLOSE: X,
  SHOW: Eye,
  HIDE: EyeOff,
  HELP: HelpCircle,
} as const;

// ========== TIME ==========
export const ICON_TIME = {
  CALENDAR: Calendar,
  CLOCK: Clock,
} as const;

// ========== USER ==========
export const ICON_USER = {
  PROFILE: UserCircle,
  LOGOUT: LogOut,
} as const;

// ========== HELPERS ==========
export type IconName = 
  | keyof typeof ICON_NAV
  | keyof typeof ICON_STAGE
  | keyof typeof ICON_ACTION
  | keyof typeof ICON_STATUS
  | keyof typeof ICON_CONTENT
  | keyof typeof ICON_UI
  | keyof typeof ICON_TIME
  | keyof typeof ICON_USER;

/**
 * Get an icon by name from the registry
 */
export function getIcon(category: 'NAV' | 'STAGE' | 'ACTION' | 'STATUS' | 'CONTENT' | 'UI' | 'TIME' | 'USER', name: string): LucideIcon {
  const registries = {
    NAV: ICON_NAV,
    STAGE: ICON_STAGE,
    ACTION: ICON_ACTION,
    STATUS: ICON_STATUS,
    CONTENT: ICON_CONTENT,
    UI: ICON_UI,
    TIME: ICON_TIME,
    USER: ICON_USER,
  };
  
  const registry = registries[category] as Record<string, LucideIcon>;
  return registry[name] || Circle;
}

/**
 * Common icon sets for quick access
 */
export const ICONS = {
  // Navigation
  nav: ICON_NAV,
  // Stages
  stage: ICON_STAGE,
  // Actions
  action: ICON_ACTION,
  // Status
  status: ICON_STATUS,
  // Content
  content: ICON_CONTENT,
  // UI
  ui: ICON_UI,
  // Time
  time: ICON_TIME,
  // User
  user: ICON_USER,
} as const;