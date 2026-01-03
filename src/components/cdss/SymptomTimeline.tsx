import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineEvent {
  day: number;
  label: string;
  description: string;
  isCurrentDay?: boolean;
  isDecisionPoint?: boolean;
}

interface SymptomTimelineProps {
  events: TimelineEvent[];
}

export function SymptomTimeline({ events }: SymptomTimelineProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Symptom Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative">
          {events.map((event, idx) => (
            <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Timeline line */}
              {idx < events.length - 1 && (
                <div className="absolute left-3.5 top-8 h-[calc(100%-2rem)] w-0.5 bg-border" />
              )}
              
              {/* Timeline dot */}
              <div
                className={cn(
                  'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                  event.isDecisionPoint
                    ? 'bg-urgency-high'
                    : event.isCurrentDay
                    ? 'bg-primary'
                    : 'bg-muted'
                )}
              >
                {event.isDecisionPoint ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-urgency-high-foreground" />
                ) : (
                  <span
                    className={cn(
                      'text-xs font-bold',
                      event.isCurrentDay ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {event.day}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Day {event.day}
                  </span>
                  {event.isCurrentDay && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                      Today
                    </span>
                  )}
                  {event.isDecisionPoint && (
                    <span className="rounded bg-urgency-high/10 px-1.5 py-0.5 text-xs font-semibold text-urgency-high">
                      Decision Point
                    </span>
                  )}
                </div>
                <p className="font-medium text-foreground">{event.label}</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
