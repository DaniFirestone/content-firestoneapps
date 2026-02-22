import { Sparkles, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

interface CheckpointSuggestionsProps {
  checkpointId: string;
  currentStage: string;
  hasContent: boolean;
}

export function CheckpointSuggestions({ checkpointId, currentStage, hasContent }: CheckpointSuggestionsProps) {
  // AI-powered suggestions based on checkpoint and stage
  const suggestions: Record<string, string[]> = {
    'proto-value-prop': [
      'Focus on a single, clear benefit rather than listing features',
      'Use this format: "Help [audience] do [action] so they can [benefit]"',
      'Example: "Help busy professionals track expenses effortlessly so they can save time and money"',
    ],
    'proto-target-user': [
      'Be specific: age range, profession, pain points',
      'Example: "Marketing managers at 10-50 person startups who struggle with content planning"',
      'Think about psychographics, not just demographics',
    ],
    'proto-key-features': [
      'List 3-5 core features that directly address user pain points',
      'Prioritize based on "must-have" vs "nice-to-have"',
      'Each feature should map to a specific user need',
    ],
    'proto-tech-stack': [
      'Consider: React for complex UIs, Vue for simplicity',
      'Backend: Node.js for full-stack JS, Python for data/ML',
      'Database: PostgreSQL for relational, MongoDB for flexibility',
    ],
  };

  const checkpointSuggestions = suggestions[checkpointId] || [];

  if (checkpointSuggestions.length === 0 || hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mt-4 border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-2 shrink-0">
              <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  AI Suggestions
                </h4>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Smart tips
                </Badge>
              </div>
              <ul className="space-y-2">
                {checkpointSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-purple-800 dark:text-purple-200 flex items-start gap-2">
                    <span className="text-purple-500 dark:text-purple-400 mt-0.5 shrink-0">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
