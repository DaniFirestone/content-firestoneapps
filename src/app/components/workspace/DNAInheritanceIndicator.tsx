import { useState } from 'react';
import { Building2, Dna, Lock, Unlock } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { toast } from 'sonner';

interface DNAInheritanceIndicatorProps {
  fieldName: string;
  value: string;
  dnaValue?: string;
  businessValue?: string;
  isOverridden: boolean;
  onToggleOverride: (fieldName: string) => void;
  usesBusinessDNA: boolean;
}

export function DNAInheritanceIndicator({
  fieldName,
  value,
  dnaValue,
  businessValue,
  isOverridden,
  onToggleOverride,
  usesBusinessDNA,
}: DNAInheritanceIndicatorProps) {
  const getSource = () => {
    if (!usesBusinessDNA || isOverridden) {
      return { type: 'custom', label: 'Custom', icon: Unlock, color: 'text-blue-500' };
    }
    if (dnaValue && dnaValue === value) {
      return { type: 'dna', label: 'DNA Profile', icon: Dna, color: 'text-purple-500' };
    }
    if (businessValue && businessValue === value) {
      return { type: 'business', label: 'Business DNA', icon: Building2, color: 'text-emerald-500' };
    }
    return { type: 'custom', label: 'Custom', icon: Unlock, color: 'text-blue-500' };
  };

  const source = getSource();
  const SourceIcon = source.icon;

  const getTooltipContent = () => {
    if (!usesBusinessDNA) {
      return 'This app does not use Business DNA';
    }
    if (isOverridden) {
      return `Custom value (overriding ${dnaValue ? 'DNA Profile' : 'Business Hub'})`;
    }
    if (source.type === 'dna') {
      return `Inherited from DNA Profile: "${dnaValue}"`;
    }
    if (source.type === 'business') {
      return `Inherited from Business Hub: "${businessValue}"`;
    }
    return 'Custom value for this app';
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={`text-xs gap-1 ${source.color} cursor-help`}
            >
              <SourceIcon className="h-3 w-3" />
              {source.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">{getTooltipContent()}</p>
          </TooltipContent>
        </Tooltip>

        {usesBusinessDNA && (dnaValue || businessValue) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  onToggleOverride(fieldName);
                  toast.success(
                    isOverridden
                      ? 'Now using inherited value'
                      : 'Now using custom value'
                  );
                }}
              >
                {isOverridden ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Unlock className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {isOverridden
                  ? 'Click to use inherited value'
                  : 'Click to customize for this app'}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}