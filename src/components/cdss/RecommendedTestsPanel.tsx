import { TestTube, Zap, Clock, Calendar, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RecommendedTest } from '@/types/clinical';

interface RecommendedTestsPanelProps {
  tests: RecommendedTest[];
  onToggleTest?: (testName: string) => void;
}

const priorityConfig = {
  immediate: {
    icon: Zap,
    label: 'IMMEDIATE',
    bgClass: 'bg-urgency-critical/10',
    textClass: 'text-urgency-critical',
    borderClass: 'border-urgency-critical/30',
  },
  urgent: {
    icon: Clock,
    label: 'URGENT',
    bgClass: 'bg-urgency-high/10',
    textClass: 'text-urgency-high',
    borderClass: 'border-urgency-high/30',
  },
  routine: {
    icon: Calendar,
    label: 'ROUTINE',
    bgClass: 'bg-success/10',
    textClass: 'text-success',
    borderClass: 'border-success/30',
  },
};

export function RecommendedTestsPanel({ tests, onToggleTest }: RecommendedTestsPanelProps) {
  const groupedTests = {
    immediate: tests.filter((t) => t.priority === 'immediate'),
    urgent: tests.filter((t) => t.priority === 'urgent'),
    routine: tests.filter((t) => t.priority === 'routine'),
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TestTube className="h-5 w-5 text-primary" />
          Recommended Investigations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        {Object.entries(groupedTests).map(([priority, priorityTests]) => {
          if (priorityTests.length === 0) return null;
          const config = priorityConfig[priority as keyof typeof priorityConfig];
          const Icon = config.icon;

          return (
            <div key={priority} className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className={cn('h-4 w-4', config.textClass)} />
                <span className={cn('text-xs font-bold uppercase tracking-wide', config.textClass)}>
                  {config.label}
                </span>
              </div>
              <div className="space-y-2">
                {priorityTests.map((test, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'rounded-lg border p-3 transition-colors',
                      config.bgClass,
                      config.borderClass,
                      test.completed && 'opacity-60'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={test.completed}
                        onCheckedChange={() => onToggleTest?.(test.name)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'font-medium text-foreground',
                              test.completed && 'line-through'
                            )}
                          >
                            {test.name}
                          </span>
                          {test.completed && (
                            <Check className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {test.rationale}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex gap-2 pt-2">
          <Button variant="default" className="flex-1 gap-2">
            Generate Order Set
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline">Print Summary</Button>
        </div>
      </CardContent>
    </Card>
  );
}
