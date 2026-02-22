import { Sparkles, Clock, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface SmartSuggestionsProps {
  appName: string;
  currentStage: string;
  daysSinceLastUpdate: number;
  healthScore: number;
  similarConcepts?: Array<{ name: string; status: string }>;
}

export function SmartSuggestions({
  appName,
  currentStage,
  daysSinceLastUpdate,
  healthScore,
  similarConcepts = [],
}: SmartSuggestionsProps) {
  const suggestions = [];

  // Stale detection
  if (daysSinceLastUpdate > 7) {
    suggestions.push({
      type: 'warning',
      icon: Clock,
      title: 'Concept seems stale',
      description: `No updates in ${daysSinceLastUpdate} days. Consider setting a next action or archiving.`,
      action: 'Set Next Action',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
    });
  }

  // Health score feedback
  if (healthScore < 50) {
    suggestions.push({
      type: 'risk',
      icon: AlertTriangle,
      title: 'Low health score',
      description: 'This concept may be losing momentum. Review blockers and adjust scope.',
      action: 'Review Blockers',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
    });
  }

  // Pattern recognition
  if (currentStage === 'brainstorming') {
    suggestions.push({
      type: 'pattern',
      icon: TrendingUp,
      title: 'You usually spend 2 weeks in Brainstorming',
      description: 'Based on your past projects, consider moving to Prototyping soon.',
      action: 'View Timeline',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
    });
  }

  // Similar concepts
  if (similarConcepts.length > 0) {
    suggestions.push({
      type: 'learning',
      icon: Lightbulb,
      title: 'Similar concept detected',
      description: `You built ${similarConcepts[0].name} before. Reuse insights or assets?`,
      action: 'View Similar',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
    });
  }

  // Scope creep detection (mock logic)
  if (currentStage === 'prototyping' && healthScore > 60 && daysSinceLastUpdate > 14) {
    suggestions.push({
      type: 'insight',
      icon: AlertTriangle,
      title: 'Possible scope creep',
      description: 'Prototyping phase is longer than usual. Focus on MVP features.',
      action: 'Review MVP',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
    });
  }

  // Positive reinforcement
  if (healthScore > 70 && daysSinceLastUpdate < 3) {
    suggestions.push({
      type: 'positive',
      icon: Sparkles,
      title: 'Great momentum!',
      description: 'You\'re making excellent progress. Keep up the consistent work.',
      action: null,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
    });
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, index) => {
        const IconComponent = suggestion.icon;
        
        return (
          <Card
            key={index}
            className={`border ${suggestion.bgColor}`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 bg-background/50 ${suggestion.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold">
                      {suggestion.title}
                    </h4>
                    <Badge variant="outline" className="text-xs shrink-0">
                      AI
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {suggestion.description}
                  </p>
                  {suggestion.action && (
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      {suggestion.action}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
