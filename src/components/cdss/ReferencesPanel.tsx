import { BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reference } from '@/types/clinical';

interface ReferencesPanelProps {
  references: Reference[];
}

export function ReferencesPanel({ references }: ReferencesPanelProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          References & Evidence Base
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="flex items-start justify-between gap-3 rounded-lg border bg-card p-3"
            >
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-semibold text-primary">
                  {ref.id}
                </span>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{ref.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {ref.source}
                    {ref.year && ` (${ref.year})`}
                  </p>
                </div>
              </div>
              {ref.url && (
                <Button variant="ghost" size="sm" className="shrink-0 gap-1">
                  View
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-foreground">
            <span className="font-medium">Note:</span> AI-assisted analysis. Final clinical
            decision requires physician judgment and additional evaluation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
