import { AlertTriangle, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UrgencyLevel } from '@/types/clinical';

interface UrgencyBannerProps {
  level: UrgencyLevel;
  message: string;
}

const urgencyConfig = {
  critical: {
    icon: AlertTriangle,
    label: 'CRITICAL PRIORITY',
    action: 'Immediate action required (<15 min)',
    bgClass: 'bg-urgency-critical',
    textClass: 'text-urgency-critical-foreground',
    borderClass: 'border-urgency-critical',
  },
  high: {
    icon: AlertCircle,
    label: 'HIGH PRIORITY',
    action: 'Urgent attention required (<2 hours)',
    bgClass: 'bg-urgency-high',
    textClass: 'text-urgency-high-foreground',
    borderClass: 'border-urgency-high',
  },
  moderate: {
    icon: Clock,
    label: 'MODERATE PRIORITY',
    action: 'Important - same day evaluation',
    bgClass: 'bg-urgency-moderate',
    textClass: 'text-urgency-moderate-foreground',
    borderClass: 'border-urgency-moderate',
  },
  low: {
    icon: CheckCircle,
    label: 'LOW PRIORITY',
    action: 'Routine follow-up',
    bgClass: 'bg-urgency-low',
    textClass: 'text-urgency-low-foreground',
    borderClass: 'border-urgency-low',
  },
};

export function UrgencyBanner({ level, message }: UrgencyBannerProps) {
  const config = urgencyConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg p-4 transition-all',
        config.bgClass,
        config.textClass
      )}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-current opacity-20" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-current opacity-10" />
      </div>
      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-current/20">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">
              {config.label}
            </span>
          </div>
          <p className="mt-1 text-lg font-semibold">{message}</p>
          <p className="mt-0.5 text-sm opacity-80">{config.action}</p>
        </div>
      </div>
    </div>
  );
}
