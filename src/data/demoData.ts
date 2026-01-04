import { DiagnosisResult, PatientData } from '@/types/clinical';

// Demo result data for the CDSS
export const demoPatientData: PatientData = {
  age: 45,
  sex: 'M',
  chiefComplaint: '3 days of fever with productive cough and chest discomfort',
  symptoms: ['Fever', 'Cough', 'Chest Pain', 'Fatigue', 'Body Ache'],
  medicalHistory: {
    conditions: ['Hypertension'],
    medications: ['Lisinopril 10mg'],
    allergies: ['Penicillin'],
    surgeries: [],
    familyHistory: ['Heart Disease'],
    socialHistory: {
      smoking: { status: true, packYears: 20 },
      alcohol: { status: false },
      occupation: 'Office worker',
    },
  },
  labResults: [
    {
      name: 'WBC Count',
      value: 14000,
      unit: 'cells/μL',
      normalRange: { min: 4000, max: 11000 },
      status: 'high',
    },
    {
      name: 'Hemoglobin',
      value: 13.5,
      unit: 'g/dL',
      normalRange: { min: 12, max: 17 },
      status: 'normal',
    },
    {
      name: 'CRP',
      value: 85,
      unit: 'mg/L',
      normalRange: { min: 0, max: 10 },
      status: 'critical',
    },
    {
      name: 'Temperature',
      value: 38.9,
      unit: '°C',
      normalRange: { min: 36.1, max: 37.2 },
      status: 'high',
    },
  ],
  vitalSigns: {
    temperature: 38.9,
    heartRate: 98,
    bloodPressure: { systolic: 135, diastolic: 88 },
    respiratoryRate: 22,
    oxygenSaturation: 94,
  },
};

export const demoDiagnosisResult: DiagnosisResult = {
  urgency: 'high',
  urgencyMessage: 'Potential respiratory infection with cardiac risk factors detected',
  differentialDiagnoses: [
    {
      name: 'Community-Acquired Pneumonia',
      confidence: 85,
      priority: 'high',
      icd10Code: 'J18.9',
      evidence: 'The combination of high fever, productive cough, and elevated inflammatory markers (WBC, CRP) strongly suggests a bacterial lower respiratory tract infection. Chest X-ray findings would be confirmatory.',
      keyIndicators: [
        { indicator: 'Fever >3 days (38.9°C)', present: true },
        { indicator: 'Productive cough', present: true },
        { indicator: 'Elevated WBC (14,000)', present: true },
        { indicator: 'Elevated CRP (85 mg/L)', present: true, critical: true },
        { indicator: 'Crackles on auscultation', present: true },
      ],
      differentialPoints: [
        'High inflammatory markers support bacterial etiology',
        'Consider atypical pathogens in smokers',
      ],
    },
    {
      name: 'Acute Bronchitis',
      confidence: 60,
      priority: 'moderate',
      icd10Code: 'J20.9',
      evidence: 'While cough is present, the high inflammatory markers and severity of symptoms make simple bronchitis less likely. This is typically a diagnosis of exclusion.',
      keyIndicators: [
        { indicator: 'Cough pattern consistent', present: true },
        { indicator: 'No focal consolidation', present: false },
        { indicator: 'High WBC count less typical', present: false },
      ],
      differentialPoints: [
        'Usually viral etiology',
        'Less likely given high inflammatory markers',
      ],
    },
    {
      name: 'Acute Coronary Syndrome',
      confidence: 35,
      priority: 'high',
      icd10Code: 'I21.9',
      evidence: 'The presence of chest pain combined with significant risk factors (male, age 45+, 20-pack-year smoker) makes it critical to rule out ACS, even if an infectious process is also present.',
      keyIndicators: [
        { indicator: 'Chest pain present', present: true, critical: true },
        { indicator: 'Smoking history (20 pack-years)', present: true, critical: true },
        { indicator: 'Age 45+ male', present: true },
        { indicator: 'Typical anginal pattern', present: false },
      ],
      differentialPoints: [
        'Must rule out given risk factors',
        'Atypical presentation possible with infection',
      ],
    },
  ],
  clinicalReasoning: [
    {
      step: 1,
      title: 'Pattern Recognition',
      input: 'Fever (3 days) + Productive cough + Chest discomfort',
      conclusion: 'Suggests lower respiratory tract infection',
      source: 'ATS Clinical Guidelines',
      evidenceGrade: 'A',
    },
    {
      step: 2,
      title: 'Laboratory Correlation',
      input: 'Elevated WBC (14,000) + High CRP (85 mg/L)',
      conclusion: 'Indicates bacterial infection likely, moderate-severe inflammation',
      source: 'Clinical Laboratory Standards',
      evidenceGrade: 'A',
    },
    {
      step: 3,
      title: 'Risk Stratification',
      input: 'Age 45, Male, 20 pack-year smoking history, Chest pain',
      conclusion: 'Elevated cardiac risk - ACS must be evaluated',
      source: 'AHA Risk Guidelines 2024',
      evidenceGrade: 'B',
    },
    {
      step: 4,
      title: 'Severity Assessment',
      input: 'SpO2 94%, RR 22, HR 98',
      conclusion: 'Moderate severity - outpatient management may be appropriate with close follow-up',
      source: 'CURB-65 Criteria',
      evidenceGrade: 'A',
    },
  ],
  recommendedTests: [
    {
      name: 'Chest X-Ray (PA + Lateral)',
      rationale: 'Confirm pneumonia, evaluate for consolidation or effusion',
      priority: 'immediate',
    },
    {
      name: 'ECG (12-lead)',
      rationale: 'Rule out acute coronary syndrome given risk factors',
      priority: 'immediate',
    },
    {
      name: 'Troponin I/T',
      rationale: 'Cardiac biomarker to exclude myocardial injury',
      priority: 'immediate',
    },
    {
      name: 'Blood Cultures x2',
      rationale: 'Identify causative organism if bacteremia suspected',
      priority: 'urgent',
    },
    {
      name: 'Sputum Culture & Sensitivity',
      rationale: 'Guide antibiotic therapy based on pathogen',
      priority: 'urgent',
    },
    {
      name: 'Procalcitonin',
      rationale: 'Help differentiate bacterial vs viral etiology',
      priority: 'routine',
    },
  ],
  treatmentPathways: [
    {
      category: 'Empirical Antibiotic Therapy',
      recommendations: [
        'Amoxicillin-clavulanate 875/125mg PO BID for 5-7 days',
        'Alternative (penicillin allergy): Azithromycin 500mg OD + Levofloxacin 750mg OD',
        'Consider adding azithromycin for atypical coverage in smokers',
      ],
      redFlags: [
        'Respiratory distress or SpO2 <90%',
        'Hemodynamic instability (SBP <90)',
        'Altered mental status',
        'New or worsening chest pain with exertion',
      ],
      followUp: 'Re-evaluate in 48-72 hours. If no improvement, consider imaging repeat and specialist referral',
    },
    {
      category: 'Supportive Care',
      recommendations: [
        'Adequate hydration (2-3L/day oral fluids)',
        'Antipyretics (Paracetamol 1g QID) for fever and discomfort',
        'Supplemental oxygen if SpO2 <92%',
        'Smoking cessation counseling',
      ],
      redFlags: [
        'Persistent fever >72 hours on antibiotics',
        'Worsening dyspnea or hypoxia',
      ],
      followUp: 'Repeat CXR in 6 weeks to confirm resolution',
    },
  ],
  references: [
    {
      id: 1,
      title: 'Community-Acquired Pneumonia Guidelines',
      source: 'American Thoracic Society / IDSA',
      year: 2019,
      url: 'https://www.thoracic.org/statements/',
    },
    {
      id: 2,
      title: 'Interpretation of Inflammatory Markers',
      source: 'Clinical Chemistry Journal',
      year: 2023,
    },
    {
      id: 3,
      title: 'Chest Pain Evaluation in Emergency Settings',
      source: 'American Heart Association',
      year: 2024,
      url: 'https://www.heart.org/en/health-topics/heart-attack',
    },
    {
      id: 4,
      title: 'CURB-65 Severity Score for Pneumonia',
      source: 'British Thoracic Society',
      year: 2009,
    },
  ],
};

export const demoTimelineEvents = [
  {
    day: 1,
    label: 'Fever onset',
    description: 'Temperature 38.5°C, mild fatigue',
  },
  {
    day: 2,
    label: 'Dry cough begins',
    description: 'Non-productive cough, continued fever',
  },
  {
    day: 3,
    label: 'Productive cough',
    description: 'Yellow-green sputum, mild chest discomfort',
  },
  {
    day: 4,
    label: 'Current presentation',
    description: 'Worsening symptoms, seeking medical attention',
    isCurrentDay: true,
    isDecisionPoint: true,
  },
];
