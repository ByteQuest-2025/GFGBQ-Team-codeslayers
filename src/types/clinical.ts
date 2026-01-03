export type UrgencyLevel = 'critical' | 'high' | 'moderate' | 'low';

export interface PatientData {
  age: number;
  sex: 'M' | 'F' | 'Other';
  chiefComplaint: string;
  symptoms: string[];
  medicalHistory: MedicalHistory;
  labResults?: LabResult[];
  vitalSigns?: VitalSigns;
  additionalNotes?: string;
}

export interface MedicalHistory {
  conditions: string[];
  medications: string[];
  allergies: string[];
  surgeries: string[];
  familyHistory: string[];
  socialHistory: {
    smoking?: { status: boolean; packYears?: number };
    alcohol?: { status: boolean; frequency?: string };
    occupation?: string;
  };
}

export interface LabResult {
  name: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface Diagnosis {
  name: string;
  confidence: number;
  priority: UrgencyLevel;
  icd10Code?: string;
  keyIndicators: { indicator: string; present: boolean; critical?: boolean }[];
  differentialPoints: string[];
}

export interface ClinicalReasoning {
  step: number;
  title: string;
  input: string;
  conclusion: string;
  source?: string;
  evidenceGrade?: 'A' | 'B' | 'C';
}

export interface RecommendedTest {
  name: string;
  rationale: string;
  priority: 'immediate' | 'urgent' | 'routine';
  completed?: boolean;
}

export interface TreatmentPathway {
  category: string;
  recommendations: string[];
  redFlags: string[];
  followUp: string;
}

export interface Reference {
  id: number;
  title: string;
  source: string;
  year?: number;
  url?: string;
}

export interface DiagnosisResult {
  urgency: UrgencyLevel;
  urgencyMessage: string;
  differentialDiagnoses: Diagnosis[];
  clinicalReasoning: ClinicalReasoning[];
  recommendedTests: RecommendedTest[];
  treatmentPathways: TreatmentPathway[];
  references: Reference[];
}
