import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { PatientData, DiagnosisResult } from "@/types/clinical";

// Initialize Gemini API
// Note: In production, this should be handled securely. For local dev/demo, we use client-side key.
const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("Checking API Key:", { hasKey: !!key, keyLength: key?.length });
  if (!key) {
    throw new Error("VITE_GEMINI_API_KEY is not set in environment variables");
  }
  return key;
};

const MODEL_NAME = "gemini-2.5-flash"; // Updated to Gemini 2.5 Flash

export interface ClinicalAnalysisInput {
  patientData: PatientData;
  uploadedFiles?: Array<{
    name: string;
    type: string;
    data?: string; // base64
    extractedText?: string;
    content?: string;
  }>;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const analyzeClinicalData = async (input: ClinicalAnalysisInput): Promise<DiagnosisResult> => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const { patientData, uploadedFiles } = input;

    // Build the system prompt
    const systemPrompt = `You are an advanced Clinical Decision Support System (CDSS) AI assistant. Your role is to help doctors with diagnostic analysis and clinical decision-making.

IMPORTANT: You provide decision SUPPORT only. Final clinical decisions must be made by qualified healthcare professionals.

Analyze the patient data and any attached medical images/documents. Provide your response as a valid JSON object with this exact structure:

{
  "urgency": "critical" | "high" | "moderate" | "low",
  "urgencyMessage": "Brief explanation of urgency level",
  "differentialDiagnoses": [
    {
      "name": "Diagnosis name",
      "confidence": 0-100,
      "priority": "critical" | "high" | "moderate" | "low",
      "icd10Code": "ICD-10 code if known",
      "keyIndicators": [
        { "indicator": "Finding", "present": true/false, "critical": true/false }
      ],
      "differentialPoints": ["Point 1", "Point 2"]
    }
  ],
  "clinicalReasoning": [
    {
      "step": 1,
      "title": "Step title",
      "input": "What was analyzed",
      "conclusion": "What was concluded",
      "source": "Source if applicable",
      "evidenceGrade": "A" | "B" | "C"
    }
  ],
  "recommendedTests": [
    {
      "name": "Test name",
      "rationale": "Why this test",
      "priority": "immediate" | "urgent" | "routine"
    }
  ],
  "treatmentPathways": [
    {
      "category": "Category name",
      "recommendations": ["Recommendation 1"],
      "redFlags": ["Red flag 1"],
      "followUp": "Follow-up guidance"
    }
  ],
  "references": [
    {
      "id": 1,
      "title": "Reference title",
      "source": "Source name",
      "year": 2024
    }
  ]
}

Be thorough, evidence-based, and always prioritize patient safety. If analyzing medical images, describe what you observe and incorporate findings into your differential diagnosis.`;

    // Construct the parts for the model
    const parts: any[] = [];

    // Add System Prompt as text (Gemini API handles system instructions differently in beta, but passing as text works for now in standard)
    // Or better yet, we can use the systemInstruction if using the beta client, but for stability we'll prepend it to the user prompt 
    // or just rely on the strong context. Let's send patient data and instructions.

    const patientContext = `
${systemPrompt}

PATIENT DATA:
- Age: ${patientData.age || 'Not specified (Extract from documents if available)'}
- Sex: ${patientData.sex ? (patientData.sex === 'M' ? 'Male' : patientData.sex === 'F' ? 'Female' : 'Other') : 'Not specified (Extract from documents if available)'}
- Chief Complaint: ${patientData.chiefComplaint || 'See attached documents'}
- Symptoms: ${patientData.symptoms.length > 0 ? patientData.symptoms.join(', ') : 'Refer to attached documents'}
- Medical History: ${patientData.medicalHistory?.conditions?.join(', ') || 'None reported'}
- Smoking: ${patientData.medicalHistory?.socialHistory?.smoking?.status ? `Yes, ${patientData.medicalHistory.socialHistory.smoking.packYears || 0} pack-years` : 'No'}
${patientData.additionalNotes ? `- Additional Notes: ${patientData.additionalNotes}` : ''}

INSTRUCTION: If patient demographics (Age, Sex) or symptoms are missing above, prioritize extracting them from the attached content/files to form your analysis.
`;

    parts.push(patientContext);

    // Add uploaded images/files
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file.type === 'image' && file.data) {
          // Remove header if present (e.g., "data:image/jpeg;base64,")
          const base64Data = file.data.split(',')[1] || file.data;

          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg" // Asume jpeg for now or extract from string
            }
          });
          parts.push(`[Image: ${file.name}]`);
        } else if (file.type === 'pdf' && file.data) {
          const base64Data = file.data.split(',')[1] || file.data;
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: "application/pdf"
            }
          });
          parts.push(`[PDF Document: ${file.name}]`);
        } else if (file.type === 'text' && file.content) {
          parts.push(`\n--- FROM FILE: ${file.name} ---\n${file.content}\n--- END FILE ---\n`);
        }
      }
    }

    const result = await model.generateContent(parts);
    const response = result.response;
    const text = response.text();

    // Clean up markdown if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    const jsonStr = jsonMatch[1] || text;

    return JSON.parse(jsonStr.trim()) as DiagnosisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const chatWithCDSS = async (
  currentMessage: string,
  history: ChatMessage[],
  patientData: PatientData,
  diagnosisResult: DiagnosisResult
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Construct the chat history with context
    // We'll create a new chat session but prepend the context
    const contextPrompt = `
You are a helpful Clinical Decision Support System assistant. 
You are discussing a specific patient case with a user (doctor or patient).

CONTEXT:
Patient Data:
Age: ${patientData.age}, Sex: ${patientData.sex}, Chief Complaint: ${patientData.chiefComplaint}
Symptoms: ${patientData.symptoms.join(', ')}

Diagnosis Result:
Urgency: ${diagnosisResult.urgency}
Top Diagnosis: ${diagnosisResult.differentialDiagnoses[0]?.name}
Reasoning: ${diagnosisResult.clinicalReasoning.map(r => r.conclusion).join(' ')}

Please answer the user's questions about this analysis, the diagnosis, or general medical queries related to this case.
Be helpful, empathetic, but clear that you are an AI assistant.
`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: contextPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I have the patient data and diagnosis context. How can I assist you today?" }],
        },
        ...history.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }))
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(currentMessage);
    const response = result.response;
    return response.text();

  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("Failed to get response from chat service");
  }
};

