import { useState } from 'react';
import { Activity, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientIntakeForm } from '@/components/cdss/PatientIntakeForm';
import { UrgencyBanner } from '@/components/cdss/UrgencyBanner';
import { DiagnosisCard } from '@/components/cdss/DiagnosisCard';
import { ClinicalReasoningPanel } from '@/components/cdss/ClinicalReasoningPanel';
import { RecommendedTestsPanel } from '@/components/cdss/RecommendedTestsPanel';
import { TreatmentPathwayPanel } from '@/components/cdss/TreatmentPathwayPanel';
import { ReferencesPanel } from '@/components/cdss/ReferencesPanel';
import { LabResultsChart } from '@/components/cdss/LabResultsChart';
import { SymptomTimeline } from '@/components/cdss/SymptomTimeline';
import { PatientData, DiagnosisResult, RecommendedTest } from '@/types/clinical';
import { UploadedFile } from '@/components/cdss/FileUploadSection';
import { demoPatientData, demoTimelineEvents } from '@/data/demoData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type View = 'intake' | 'results';

export default function CDSSDashboard() {
  const [view, setView] = useState<View>('intake');
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [tests, setTests] = useState<RecommendedTest[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (data: PatientData, files: UploadedFile[]) => {
    setIsLoading(true);
    setPatientData(data);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('analyze-clinical', {
        body: {
          patientData: data,
          uploadedFiles: files.map(f => ({
            name: f.name,
            type: f.type,
            data: f.data,
            content: f.content,
            extractedText: f.extractedText
          }))
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response as DiagnosisResult);
      setTests(response.recommendedTests || []);
      setView('results');
      
      toast({
        title: "Analysis Complete",
        description: "Clinical decision support analysis has been generated.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze patient data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTest = (testName: string) => {
    setTests((prev) =>
      prev.map((t) =>
        t.name === testName ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleNewPatient = () => {
    setView('intake');
    setPatientData(null);
    setResult(null);
    setTests([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Clinical Decision Support</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Diagnostic Assistance</p>
            </div>
          </div>
          {view === 'results' && (
            <Button variant="outline" onClick={handleNewPatient} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              New Patient
            </Button>
          )}
        </div>
      </header>

      <main className="container py-6">
        {view === 'intake' ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Patient Assessment</h2>
              <p className="mt-1 text-muted-foreground">
                Enter patient information for AI-assisted diagnostic analysis
              </p>
            </div>
            <PatientIntakeForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Urgency Banner */}
            <UrgencyBanner level={result.urgency} message={result.urgencyMessage} />

            {/* Patient Summary */}
            {patientData && (
              <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {patientData.age} year old {patientData.sex === 'M' ? 'Male' : patientData.sex === 'F' ? 'Female' : 'Patient'}
                  </p>
                  <p className="text-sm text-muted-foreground">{patientData.chiefComplaint}</p>
                </div>
              </div>
            )}

            <Tabs defaultValue="diagnosis" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="treatment">Treatment</TabsTrigger>
              </TabsList>

              <TabsContent value="diagnosis" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Differential Diagnoses */}
                  <div className="space-y-4 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Differential Diagnosis ({result.differentialDiagnoses.length} possibilities)
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {result.differentialDiagnoses.map((diagnosis, idx) => (
                        <DiagnosisCard
                          key={idx}
                          diagnosis={diagnosis}
                          rank={idx + 1}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Lab Results */}
                  {demoPatientData.labResults && (
                    <LabResultsChart results={demoPatientData.labResults} />
                  )}

                  {/* Timeline */}
                  <SymptomTimeline events={demoTimelineEvents} />
                </div>
              </TabsContent>

              <TabsContent value="reasoning" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <ClinicalReasoningPanel
                    reasoning={result.clinicalReasoning}
                    conclusion={`Primary diagnosis based on clinical findings and AI analysis.`}
                  />
                  <ReferencesPanel references={result.references} />
                </div>
              </TabsContent>

              <TabsContent value="tests">
                <div className="mx-auto max-w-2xl">
                  <RecommendedTestsPanel tests={tests} onToggleTest={handleToggleTest} />
                </div>
              </TabsContent>

              <TabsContent value="treatment">
                <div className="mx-auto max-w-2xl space-y-6">
                  {result.treatmentPathways.map((pathway, idx) => (
                    <TreatmentPathwayPanel key={idx} pathways={[pathway]} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </main>
    </div>
  );
}
