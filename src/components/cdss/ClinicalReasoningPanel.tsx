import { Brain, BookOpen, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClinicalReasoning } from '@/types/clinical';

interface ClinicalReasoningPanelProps {
  reasoning: ClinicalReasoning[];
  conclusion: string;
}

const gradeColors = {
  A: 'bg-success/10 text-success border-success/30',
  B: 'bg-warning/10 text-warning border-warning/30',
  C: 'bg-muted text-muted-foreground border-border',
};

export function ClinicalReasoningPanel({ reasoning, conclusion }: ClinicalReasoningPanelProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          Clinical Reasoning
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {reasoning.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex gap-4 p-4">
                {/* Step indicator */}
                <div className="relative flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  {idx < reasoning.length - 1 && (
                    <div className="absolute left-1/2 top-10 h-[calc(100%-2rem)] w-0.5 -translate-x-1/2 bg-border" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{step.title}</h4>
                    {step.evidenceGrade && (
                      <Badge
                        variant="outline"
                        className={cn('text-xs', gradeColors[step.evidenceGrade])}
                      >
                        Grade {step.evidenceGrade}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Input:</span> {step.input}
                  </p>
                  <p className="text-sm">
                    <span className="text-primary">→</span>{' '}
                    <span className="text-foreground">{step.conclusion}</span>
                  </p>
                  {step.source && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span>{step.source}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="border-t bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <ArrowDown className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Conclusion
              </span>
              <p className="mt-0.5 font-medium text-foreground">{conclusion}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
