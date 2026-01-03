import { useState } from 'react';
import { User, Mic, Plus, X, Stethoscope, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { PatientData } from '@/types/clinical';
import { FileUploadSection, UploadedFile } from './FileUploadSection';
import { cn } from '@/lib/utils';

interface PatientIntakeFormProps {
  onSubmit: (data: PatientData, files: UploadedFile[]) => void;
  isLoading?: boolean;
}

const commonSymptoms = [
  'Fever', 'Cough', 'Chest Pain', 'Headache', 'Fatigue',
  'Shortness of Breath', 'Nausea', 'Body Ache', 'Dizziness'
];

const commonConditions = [
  'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'COPD'
];

export function PatientIntakeForm({ onSubmit, isLoading }: PatientIntakeFormProps) {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'M' | 'F' | 'Other'>('M');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [conditions, setConditions] = useState<Record<string, boolean>>({});
  const [smoking, setSmoking] = useState(false);
  const [packYears, setPackYears] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = () => {
    const patientData: PatientData = {
      age: parseInt(age) || 0,
      sex,
      chiefComplaint,
      symptoms: selectedSymptoms,
      medicalHistory: {
        conditions: Object.entries(conditions).filter(([, v]) => v).map(([k]) => k),
        medications: [],
        allergies: [],
        surgeries: [],
        familyHistory: [],
        socialHistory: {
          smoking: { status: smoking, packYears: smoking ? parseInt(packYears) : undefined },
        },
      },
      additionalNotes: additionalNotes,
    };
    onSubmit(patientData, uploadedFiles);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Patient Intake
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Demographics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <User className="h-4 w-4 text-primary" />
            Patient Profile
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sex</Label>
              <div className="flex gap-2">
                {(['M', 'F', 'Other'] as const).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={sex === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSex(s)}
                    className="flex-1"
                  >
                    {s === 'M' ? 'Male' : s === 'F' ? 'Female' : 'Other'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="complaint">Chief Complaint</Label>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Mic className="h-3.5 w-3.5" />
              Voice
            </Button>
          </div>
          <Textarea
            id="complaint"
            placeholder="Describe the patient's main concern..."
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            rows={3}
          />
        </div>

        {/* Quick Add Symptoms */}
        <div className="space-y-3">
          <Label>Quick Add Symptoms</Label>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <Badge
                key={symptom}
                variant={selectedSymptoms.includes(symptom) ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-colors',
                  selectedSymptoms.includes(symptom) && 'bg-primary text-primary-foreground'
                )}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add custom symptom..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
            />
            <Button variant="outline" size="icon" onClick={addCustomSymptom}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {selectedSymptoms.filter(s => !commonSymptoms.includes(s)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.filter(s => !commonSymptoms.includes(s)).map((symptom) => (
                <Badge key={symptom} className="gap-1">
                  {symptom}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleSymptom(symptom)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="space-y-3">
          <Label>Upload Medical Documents</Label>
          <FileUploadSection
            files={uploadedFiles}
            onFilesChange={setUploadedFiles}
            isProcessing={isLoading}
          />
        </div>

        {/* Additional Notes */}
        <div className="space-y-3">
          <Label htmlFor="notes">Additional Clinical Notes</Label>
          <Textarea
            id="notes"
            placeholder="Lab results, imaging findings, or any other relevant information..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Medical History */}
        <div className="space-y-3">
          <Label>Relevant Medical History</Label>
          <div className="space-y-2">
            {commonConditions.map((condition) => (
              <div key={condition} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-foreground">{condition}</span>
                <Switch
                  checked={conditions[condition] || false}
                  onCheckedChange={(checked) =>
                    setConditions((prev) => ({ ...prev, [condition]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social History */}
        <div className="space-y-3">
          <Label>Social History</Label>
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Smoking</span>
              <Switch checked={smoking} onCheckedChange={setSmoking} />
            </div>
            {smoking && (
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="Pack years"
                  value={packYears}
                  onChange={(e) => setPackYears(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">pack-years</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading || (!age && !chiefComplaint && uploadedFiles.length === 0)}
          className={cn(
            "w-full gap-2 transition-all duration-300",
            "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90",
            "shadow-lg hover:shadow-xl hover:scale-[1.02]",
            isLoading && "animate-pulse cursor-not-allowed opacity-90"
          )}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing with AI...</span>
            </div>
          ) : (
            <>
              <Send className="h-4 w-4 animate-in slide-in-from-left-1" />
              Analyze Patient Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
