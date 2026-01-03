import { ChevronRight, Check, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Diagnosis, UrgencyLevel } from '@/types/clinical';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  rank: number;
  onViewEvidence?: () => void;
}

const priorityStyles: Record<UrgencyLevel, { badge: string; bar: string }> = {
  critical: {
    badge: 'bg-urgency-critical text-urgency-critical-foreground',
    bar: 'bg-urgency-critical',
  },
  high: {
    badge: 'bg-urgency-high text-urgency-high-foreground',
    bar: 'bg-urgency-high',
  },
  moderate: {
    badge: 'bg-urgency-moderate text-urgency-moderate-foreground',
    bar: 'bg-urgency-moderate',
  },
  low: {
    badge: 'bg-urgency-low text-urgency-low-foreground',
    bar: 'bg-urgency-low',
  },
};

export function DiagnosisCard({ diagnosis, rank, onViewEvidence }: DiagnosisCardProps) {
  const styles = priorityStyles[diagnosis.priority];

  return (
    <Card className="overflow-hidden border-l-4 transition-shadow hover:shadow-md" style={{ borderLeftColor: `hsl(var(--urgency-${diagnosis.priority}))` }}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
              {rank}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {diagnosis.name}
              </h3>
              {diagnosis.icd10Code && (
                <span className="text-xs text-muted-foreground">
                  ICD-10: {diagnosis.icd10Code}
                </span>
              )}
            </div>
          </div>
          <Badge className={cn('shrink-0 uppercase', styles.badge)}>
            {diagnosis.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-semibold text-foreground">{diagnosis.confidence}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn('h-full rounded-full transition-all', styles.bar)}
              style={{ width: `${diagnosis.confidence}%` }}
            />
          </div>
        </div>

        {/* Key indicators */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Key Indicators:</span>
          <div className="space-y-1.5">
            {diagnosis.keyIndicators.map((indicator, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm',
                  indicator.present
                    ? indicator.critical
                      ? 'bg-urgency-critical/10 text-urgency-critical'
                      : 'bg-success/10 text-success'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {indicator.present ? (
                  indicator.critical ? (
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <Check className="h-3.5 w-3.5 shrink-0" />
                  )
                ) : (
                  <X className="h-3.5 w-3.5 shrink-0" />
                )}
                <span>{indicator.indicator}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewEvidence}
            className="gap-1"
          >
            View Evidence
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
