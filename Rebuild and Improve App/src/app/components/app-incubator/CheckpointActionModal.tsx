import { ICONS } from '../../lib/icon-registry';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface CheckpointActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkpoint: {
    id: string;
    label: string;
    ctaLabel: string;
    description: string;
  };
  isComplete: boolean;
  onToggleComplete: () => void;
  appName: string;
  appColor?: string;
}

// Guidance content for each checkpoint type
const CHECKPOINT_GUIDANCE: Record<string, {
  description: string;
  questions: string[];
  aiPrompt?: string;
  template?: string;
  tips: string[];
}> = {
  'idea-problem': {
    description: 'Clearly articulate the specific problem your app solves and why it matters to your target users.',
    questions: [
      'What specific problem does this solve?',
      'Who experiences this problem most acutely?',
      'What are they doing now to solve it?',
    ],
    aiPrompt: 'I\'m building [app name]. Help me clearly define the core problem it solves by asking clarifying questions about the pain points, current alternatives, and why this matters.',
    tips: [
      'Be specific - "save time" is too vague',
      'Talk to potential users first',
      'Validate that this problem actually exists',
    ],
  },
  'idea-solution': {
    description: 'Define your unique approach and core value proposition in a clear, compelling way.',
    questions: [
      'What\'s your solution in one sentence?',
      'What makes your approach unique?',
      'How will users access this solution?',
    ],
    aiPrompt: 'Help me articulate a clear solution statement for [app name] that addresses [problem]. Focus on the unique approach and core value.',
    tips: [
      'Focus on outcomes, not features',
      'Keep it simple and understandable',
      'Differentiate from existing solutions',
    ],
  },
  'idea-audience': {
    description: 'Create detailed user personas including demographics, behaviors, and pain points.',
    questions: [
      'Who is your ideal user?',
      'What are their demographics and behaviors?',
      'Where do they spend time online?',
    ],
    aiPrompt: 'Help me define the target audience for [app name]. Create a detailed user persona including demographics, pain points, goals, and behavior patterns.',
    tips: [
      'Create 1-2 detailed personas',
      'Be specific about demographics',
      'Understand their current workflow',
    ],
  },
  'idea-validation': {
    description: 'Gather evidence that people actually want this solution before investing significant time.',
    questions: [
      'What evidence suggests people want this?',
      'Have you talked to potential users?',
      'What would prove this idea is viable?',
    ],
    tips: [
      'Talk to at least 10 potential users',
      'Look for competitors (existence = validation)',
      'Test willingness to pay, not just interest',
    ],
  },
  'brainstorm-mvp': {
    description: 'Define the absolute minimum feature set needed to deliver value and test your core hypothesis.',
    questions: [
      'What\'s the absolute minimum feature set?',
      'What can you cut and still solve the problem?',
      'How will you measure success?',
    ],
    aiPrompt: 'Help me define an MVP for [app name]. Given [problem] and [solution], what are the absolute minimum features needed to deliver value?',
    template: '**MVP Feature List**\n\n**Must Have (Core):**\n- [ ] Feature 1\n- [ ] Feature 2\n\n**Success Metrics:**\n- Metric 1: [target]\n- Metric 2: [target]\n\n**Out of Scope:**\n- Feature X\n- Feature Y',
    tips: [
      'Cut ruthlessly - most features aren\'t essential',
      'Focus on one core workflow',
      'You can always add more later',
    ],
  },
  'brainstorm-research': {
    description: 'Study competitors to understand what works, what doesn\'t, and where the gaps are.',
    questions: [
      'Who are your direct competitors?',
      'What do they do well?',
      'Where are the gaps in their offerings?',
    ],
    tips: [
      'Study 3-5 direct competitors in depth',
      'Sign up and use their products',
      'Read their reviews and complaints',
    ],
  },
  'brainstorm-tech': {
    description: 'Choose your technology stack based on what you know and what enables speed.',
    questions: [
      'What technologies will you use?',
      'Web, mobile, or both?',
      'Any third-party services needed?',
    ],
    template: '**Tech Stack**\n\n**Frontend:** [React, Next.js, etc.]\n**Backend:** [Node, Python, etc.]\n**Database:** [PostgreSQL, etc.]\n**Hosting:** [Vercel, AWS, etc.]\n**Services:** [Stripe, Auth0, etc.]\n\n**Why:** [Your reasoning]',
    tips: [
      'Choose what you know',
      'Optimize for speed, not perfection',
      'Leverage existing services (auth, payments, etc.)',
    ],
  },
  'brainstorm-scope': {
    description: 'Set realistic boundaries for your v1 release with clear timelines and deferred features.',
    questions: [
      'What\'s in scope for v1?',
      'What features are explicitly deferred?',
      'What\'s your timeline?',
    ],
    template: '**Project Scope**\n\n**Timeline:** [X weeks/months]\n**Team:** [Solo / X people]\n\n**V1 Includes:**\n- Feature set A\n\n**V2 and Beyond:**\n- Feature set B',
    tips: [
      'Be realistic about time and resources',
      'Buffer your estimates by 2x',
      'Plan for v1, v2, v3 releases',
    ],
  },
  'prototype-design': {
    description: 'Map out key screens, user flows, and visual style with wireframes or mockups.',
    questions: [
      'What are the key screens/views?',
      'What\'s the user flow?',
      'Have you created mockups/wireframes?',
    ],
    tips: [
      'Start with low-fidelity wireframes',
      'Map out the complete user journey',
      'Get feedback before building',
    ],
  },
  'prototype-build': {
    description: 'Create a testable prototype that demonstrates core functionality, even if rough.',
    questions: [
      'Have you built a working prototype?',
      'Does it demonstrate the core functionality?',
      'Can users test it?',
    ],
    tips: [
      'It doesn\'t need to be pretty',
      'Focus on the core user flow',
      'Get something testable ASAP',
    ],
  },
  'prototype-test': {
    description: 'Watch real users interact with your prototype and gather candid feedback.',
    questions: [
      'Who has tested your prototype?',
      'What feedback did you receive?',
      'What needs to change?',
    ],
    template: '**User Testing Summary**\n\n**Testers:** [5-10 people]\n\n**Key Insights:**\n- Insight 1\n- Insight 2\n\n**What Worked:**\n- Thing 1\n\n**What Didn\'t:**\n- Thing 1\n\n**Changes:**\n- [ ] Change 1',
    tips: [
      'Watch users interact, don\'t just ask',
      'Ask open-ended questions',
      'Look for patterns in feedback',
    ],
  },
  'prototype-iterate': {
    description: 'Make improvements based on testing feedback and validate changes work better.',
    questions: [
      'What changes have you made based on feedback?',
      'Have you tested again?',
      'Are you ready to build the real thing?',
    ],
    tips: [
      'Expect to iterate 3-5 times',
      'Small changes, test again',
      'Know when "good enough" is good enough',
    ],
  },
  'final-build': {
    description: 'Build the production version with clean code, error handling, and scalability in mind.',
    questions: [
      'Is your code clean and maintainable?',
      'Have you handled edge cases?',
      'Is it ready for real users?',
    ],
    tips: [
      'Write tests for critical paths',
      'Set up error monitoring',
      'Document your code',
    ],
  },
  'final-polish': {
    description: 'Refine the UI/UX, optimize performance, and fix all critical bugs.',
    questions: [
      'Have you refined the UI/UX?',
      'Is the performance optimized?',
      'Does it feel professional?',
    ],
    tips: [
      'Get a designer\'s eye if possible',
      'Test on multiple devices',
      'Sweat the small details',
    ],
  },
  'final-launch': {
    description: 'Execute your launch strategy with analytics in place and clear success metrics.',
    questions: [
      'What\'s your launch strategy?',
      'Where will you announce?',
      'Do you have analytics set up?',
    ],
    template: '**Launch Plan**\n\n**Date:** [Date]\n\n**Channels:**\n- [ ] Product Hunt\n- [ ] Twitter/X\n- [ ] Reddit\n- [ ] Email list\n\n**Key Message:**\n[Your pitch]\n\n**Success:**\n- X signups week 1',
    tips: [
      'Launch small, iterate fast',
      'Have analytics ready',
      'Plan for ongoing marketing',
    ],
  },
  'final-feedback': {
    description: 'Collect and analyze user feedback to guide your next iteration priorities.',
    questions: [
      'How are you collecting user feedback?',
      'What are users saying?',
      'What will you improve next?',
    ],
    tips: [
      'Add in-app feedback mechanisms',
      'Monitor support channels',
      'Track key metrics religiously',
    ],
  },
};

export function CheckpointActionModal({
  open,
  onOpenChange,
  checkpoint,
  isComplete,
  onToggleComplete,
  appName,
  appColor,
}: CheckpointActionModalProps) {
  const guidance = CHECKPOINT_GUIDANCE[checkpoint.id] || {
    description: '',
    questions: [],
    tips: [],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-1">
            <DialogTitle className="text-lg">{checkpoint.ctaLabel}</DialogTitle>
            {isComplete && (
              <Badge
                variant="secondary"
                className="shrink-0"
                style={appColor ? {
                  backgroundColor: appColor + '15',
                  color: appColor,
                  borderColor: appColor + '30',
                } : {}}
              >
                <ICONS.status.CHECKED className="mr-1 h-3 w-3" />
                Complete
              </Badge>
            )}
          </div>
          <DialogDescription className="text-sm">
            {guidance.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Guiding Questions */}
          {guidance.questions && guidance.questions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Key Questions
              </h4>
              <ul className="space-y-1.5">
                {guidance.questions.map((question, idx) => (
                  <li key={idx} className="flex gap-2.5 text-sm leading-relaxed">
                    <span 
                      className="shrink-0 mt-0.5"
                      style={appColor ? { color: appColor } : { color: 'hsl(var(--primary))' }}
                    >
                      •
                    </span>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Prompt */}
          {guidance.aiPrompt && (
            <div 
              className="border-l-2 pl-4 py-1"
              style={appColor ? {
                borderColor: appColor + '40',
              } : {
                borderColor: 'hsl(var(--primary) / 0.3)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ICONS.nav.AI_SPARKLE className="h-3.5 w-3.5" style={appColor ? { color: appColor } : {}} />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  AI Prompt
                </h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2.5 leading-relaxed">
                "{guidance.aiPrompt}"
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(guidance.aiPrompt!);
                }}
              >
                <ICONS.action.COPY className="mr-1.5 h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
          )}

          {/* Template */}
          {guidance.template && (
            <div 
              className="border-l-2 pl-4 py-1"
              style={appColor ? {
                borderColor: appColor + '40',
              } : {
                borderColor: 'hsl(var(--primary) / 0.3)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ICONS.content.FILE className="h-3.5 w-3.5" style={appColor ? { color: appColor } : {}} />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Template
                </h4>
              </div>
              <pre className="text-xs bg-muted/50 border rounded-md p-3 overflow-x-auto whitespace-pre-wrap font-mono mb-2.5">
                {guidance.template}
              </pre>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(guidance.template!);
                }}
              >
                <ICONS.action.COPY className="mr-1.5 h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
          )}

          {/* Tips */}
          {guidance.tips && guidance.tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tips
              </h4>
              <ul className="space-y-1.5">
                {guidance.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-2.5 text-sm leading-relaxed">
                    <span 
                      className="shrink-0 mt-0.5 font-semibold"
                      style={appColor ? { color: appColor } : { color: 'hsl(var(--primary))' }}
                    >
                      ✓
                    </span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              onToggleComplete();
              onOpenChange(false);
            }}
            className="flex-1 sm:flex-initial"
            style={appColor && !isComplete ? {
              backgroundColor: appColor,
              color: 'white',
            } : {}}
          >
            {isComplete ? (
              <>
                <ICONS.status.UNCHECKED className="mr-2 h-4 w-4" />
                Mark Incomplete
              </>
            ) : (
              <>
                <ICONS.status.CHECKED className="mr-2 h-4 w-4" />
                Mark Complete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}