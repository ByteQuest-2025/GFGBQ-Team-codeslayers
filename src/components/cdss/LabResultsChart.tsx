import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';
import { LabResult } from '@/types/clinical';

interface LabResultsChartProps {
  results: LabResult[];
}

const statusColors = {
  normal: 'bg-success text-success-foreground',
  high: 'bg-urgency-high text-urgency-high-foreground',
  low: 'bg-info text-info-foreground',
  critical: 'bg-urgency-critical text-urgency-critical-foreground',
};

export function LabResultsChart({ results }: LabResultsChartProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FlaskConical className="h-5 w-5 text-primary" />
          Laboratory Interpretation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {results.map((result, idx) => {
          const rangeWidth = result.normalRange.max - result.normalRange.min;
          const extendedMin = result.normalRange.min - rangeWidth * 0.5;
          const extendedMax = result.normalRange.max + rangeWidth * 0.5;
          const totalRange = extendedMax - extendedMin;
          
          const normalStartPercent = ((result.normalRange.min - extendedMin) / totalRange) * 100;
          const normalWidthPercent = (rangeWidth / totalRange) * 100;
          const valuePercent = Math.max(0, Math.min(100, ((result.value - extendedMin) / totalRange) * 100));

          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{result.name}</span>
                <div className="flex items-center gap-2">
                  <span className={cn('rounded px-2 py-0.5 text-xs font-semibold', statusColors[result.status])}>
                    {result.status.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {result.value} {result.unit}
                  </span>
                </div>
              </div>
              
              {/* Visual range indicator */}
              <div className="relative h-6 w-full rounded-full bg-muted">
                {/* Normal range indicator */}
                <div
                  className="absolute h-full rounded-full bg-success/30"
                  style={{
                    left: `${normalStartPercent}%`,
                    width: `${normalWidthPercent}%`,
                  }}
                />
                
                {/* Value marker */}
                <div
                  className={cn(
                    'absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card shadow-md',
                    result.status === 'normal' ? 'bg-success' : result.status === 'critical' ? 'bg-urgency-critical' : 'bg-urgency-high'
                  )}
                  style={{ left: `${valuePercent}%` }}
                />
              </div>
              
              {/* Range labels */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Normal: {result.normalRange.min} - {result.normalRange.max} {result.unit}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
