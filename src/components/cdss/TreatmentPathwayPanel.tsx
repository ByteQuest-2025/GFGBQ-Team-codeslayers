import { Pill, AlertTriangle, Calendar, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreatmentPathway } from '@/types/clinical';

interface TreatmentPathwayPanelProps {
  pathways: TreatmentPathway[];
}

export function TreatmentPathwayPanel({ pathways }: TreatmentPathwayPanelProps) {
  const handleViewGuidelines = () => {
    // In a real app, this would link to clinical guidelines, e.g., UpToDate, or a specific URL.
    console.log('Triggered action to view full clinical guidelines.');
    window.open('https://www.uptodate.com/contents/search', '_blank', 'noopener,noreferrer');
  };

  const handleExportPlan = () => {
    // This would trigger a download or API call to generate a document (PDF, etc.)
    console.log('Exporting treatment plan...');
    alert('Export functionality is a placeholder. It would typically generate a PDF or other document format.');
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Pill className="h-5 w-5 text-primary" />
          Management Considerations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        {pathways.map((pathway, idx) => (
          <div key={idx} className="space-y-3">
            <h4 className="font-semibold text-foreground">{pathway.category}</h4>
            
            {/* Recommendations */}
            <div className="space-y-2 rounded-lg bg-accent/50 p-3">
              {pathway.recommendations.map((rec, recIdx) => (
                <div key={recIdx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span className="text-foreground">{rec}</span>
                </div>
              ))}
            </div>

            {/* Red flags */}
            {pathway.redFlags.length > 0 && (
              <div className="space-y-2 rounded-lg border border-urgency-critical/30 bg-urgency-critical/10 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-urgency-critical">
                  <AlertTriangle className="h-4 w-4" />
                  Red Flags (Escalate if present):
                </div>
                {pathway.redFlags.map((flag, flagIdx) => (
                  <div key={flagIdx} className="flex items-start gap-2 pl-6 text-sm text-foreground">
                    <span className="text-urgency-critical">•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Follow-up */}
            <div className="flex items-start gap-2 rounded-lg bg-info/10 p-3 text-sm">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-info" />
              <div>
                <span className="font-medium text-info">Follow-up: </span>
                <span className="text-foreground">{pathway.followUp}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-2 border-t pt-4">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleViewGuidelines}>
            <FileText className="h-4 w-4" />
            View Full Guidelines
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportPlan}>
            Export Plan
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
