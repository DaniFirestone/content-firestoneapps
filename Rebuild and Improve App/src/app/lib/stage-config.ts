import { type LucideIcon } from 'lucide-react';
import { ICON_STAGE } from './icon-registry';

// Stage configuration with validation checkpoints
export interface StageConfig {
  id: string;
  label: string;
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  keyQuestions: string[];
  keyActivities: string[];
  validationCheckpoints: {
    id: string;
    label: string;
    description: string;
    ctaLabel: string; // Short, actionable CTA text
    fieldName: keyof import('../lib/mock-data').AppConcept; // Tie to actual data field
    fieldType: 'text' | 'textarea' | 'url';
    placeholder: string;
  }[];
  nextStagePrompt: string;
  canArchive?: boolean; // Allow archiving from this stage
}

// Import icons dynamically to avoid circular dependencies
import { Archive } from 'lucide-react';

export const STAGE_CONFIGS: Record<string, StageConfig> = {
  idea: {
    id: 'idea',
    label: 'Idea',
    title: 'Idea',
    icon: ICON_STAGE.IDEA,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500',
    description: 'Capture and frame your concept',
    keyQuestions: [
      'What problem does this solve?',
      'Who has this problem?',
      'Why now?',
    ],
    keyActivities: [
      'Write a clear problem statement',
      'Identify your target user',
      'Note similar solutions',
    ],
    validationCheckpoints: [
      { 
        id: 'problem', 
        label: 'Problem defined', 
        description: 'Clear problem statement', 
        ctaLabel: 'Define Problem',
        fieldName: 'problemStatement', 
        fieldType: 'textarea', 
        placeholder: 'Describe the problem your concept solves...' 
      },
      { 
        id: 'user', 
        label: 'Target user identified', 
        description: 'Who experiences this problem', 
        ctaLabel: 'Identify Users',
        fieldName: 'targetUser', 
        fieldType: 'textarea', 
        placeholder: 'Who is your target user? Be specific...' 
      },
      { 
        id: 'solution', 
        label: 'Solution sketched', 
        description: 'How you might solve it', 
        ctaLabel: 'Sketch Solution',
        fieldName: 'solutionDescription', 
        fieldType: 'textarea', 
        placeholder: 'How will you solve this problem?' 
      },
    ],
    nextStagePrompt: 'Ready to validate your idea?',
  },
  brainstorming: {
    id: 'brainstorming',
    label: 'Brainstorming',
    title: 'Brainstorming',
    icon: ICON_STAGE.BRAINSTORMING,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500',
    description: 'Validate and refine your concept',
    keyQuestions: [
      'Is this problem worth solving?',
      'Do people actually want this?',
      'What makes this different?',
    ],
    keyActivities: [
      'Research competitors',
      'Interview potential users',
      'Validate market demand',
    ],
    validationCheckpoints: [
      { 
        id: 'research', 
        label: 'Market researched', 
        description: 'Competitors and alternatives analyzed', 
        ctaLabel: 'Research Market',
        fieldName: 'marketResearch', 
        fieldType: 'textarea', 
        placeholder: 'Document your competitive research and alternatives...' 
      },
      { 
        id: 'interviews', 
        label: 'Users interviewed', 
        description: 'Talked to 5+ target users', 
        ctaLabel: 'Interview Users',
        fieldName: 'userInterviewNotes', 
        fieldType: 'textarea', 
        placeholder: 'Summarize insights from user interviews...' 
      },
      { 
        id: 'demand', 
        label: 'Demand validated', 
        description: 'Evidence people want this', 
        ctaLabel: 'Validate Demand',
        fieldName: 'demandEvidence', 
        fieldType: 'textarea', 
        placeholder: 'What evidence shows people want this solution?' 
      },
    ],
    nextStagePrompt: 'Ready to start building?',
  },
  prototyping: {
    id: 'prototyping',
    label: 'Prototyping',
    title: 'Prototyping',
    icon: ICON_STAGE.PROTOTYPING,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500',
    description: 'Build and test your MVP',
    keyQuestions: [
      "What's the minimum viable version?",
      'How will I build this?',
      'Will people actually use it?',
    ],
    keyActivities: [
      'Define MVP scope',
      'Choose tech stack',
      'Build and test',
    ],
    validationCheckpoints: [
      { 
        id: 'mvp', 
        label: 'MVP defined', 
        description: 'Core features identified', 
        ctaLabel: 'Define MVP',
        fieldName: 'mvpScope', 
        fieldType: 'textarea', 
        placeholder: 'What are the core features of your MVP?' 
      },
      { 
        id: 'tech', 
        label: 'Tech chosen', 
        description: 'Technology decisions made', 
        ctaLabel: 'Choose Tech Stack',
        fieldName: 'techStackRationale', 
        fieldType: 'textarea', 
        placeholder: 'Why did you choose this tech stack?' 
      },
      { 
        id: 'prototype', 
        label: 'Prototype built', 
        description: 'Working version exists', 
        ctaLabel: 'Build Prototype',
        fieldName: 'prototypeUrl', 
        fieldType: 'url', 
        placeholder: 'https://your-prototype-url.com' 
      },
      { 
        id: 'feedback', 
        label: 'Feedback collected', 
        description: 'Users have tested it', 
        ctaLabel: 'Collect Feedback',
        fieldName: 'userFeedback', 
        fieldType: 'textarea', 
        placeholder: 'What did users say about your prototype?' 
      },
    ],
    nextStagePrompt: 'Ready to polish for launch?',
  },
  final: {
    id: 'final',
    label: 'Final',
    title: 'Final',
    icon: ICON_STAGE.FINAL,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500',
    description: 'Polish and prepare for launch',
    keyQuestions: [
      'Is this ready to launch?',
      'How will I get users?',
      "What's my launch plan?",
    ],
    keyActivities: [
      'Polish user experience',
      'Prepare launch materials',
      'Plan go-to-market',
    ],
    validationCheckpoints: [
      { 
        id: 'polish', 
        label: 'UX polished', 
        description: 'Ready for real users', 
        ctaLabel: 'Polish UX',
        fieldName: 'uxPolishNotes', 
        fieldType: 'textarea', 
        placeholder: 'How did you polish the UX? What improvements were made?' 
      },
      { 
        id: 'marketing', 
        label: 'Marketing ready', 
        description: 'Launch materials prepared', 
        ctaLabel: 'Prepare Marketing',
        fieldName: 'marketingPlan', 
        fieldType: 'textarea', 
        placeholder: 'Describe your marketing materials and strategy...' 
      },
      { 
        id: 'launch', 
        label: 'Launch plan', 
        description: 'GTM strategy defined', 
        ctaLabel: 'Plan Launch',
        fieldName: 'launchStrategy', 
        fieldType: 'textarea', 
        placeholder: 'What is your go-to-market strategy?' 
      },
    ],
    nextStagePrompt: 'Ready to launch?',
  },
  archived: {
    id: 'archived',
    label: 'Archived',
    title: 'Archived',
    icon: Archive,
    color: 'text-gray-500 dark:text-gray-400',
    bgColor: 'bg-gray-400',
    description: 'Shelved or completed concepts',
    keyQuestions: [],
    keyActivities: [],
    validationCheckpoints: [],
    nextStagePrompt: '',
  },
};

export function getStageConfig(stageId: string): StageConfig | null {
  return STAGE_CONFIGS[stageId] || null;
}

// Export stages array for iteration
export const stages = [
  STAGE_CONFIGS.idea,
  STAGE_CONFIGS.brainstorming,
  STAGE_CONFIGS.prototyping,
  STAGE_CONFIGS.final,
];