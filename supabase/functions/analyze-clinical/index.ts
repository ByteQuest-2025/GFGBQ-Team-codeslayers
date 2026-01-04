import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientData, uploadedFiles } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the content array for multimodal analysis
    const contentParts: any[] = [];

    // Add patient data as text
    const patientContext = `
PATIENT DATA:
- Age: ${patientData.age} years
- Sex: ${patientData.sex === 'M' ? 'Male' : patientData.sex === 'F' ? 'Female' : 'Other'}
- Chief Complaint: ${patientData.chiefComplaint}
- Symptoms: ${patientData.symptoms.join(', ')}
- Medical History: ${patientData.medicalHistory?.conditions?.join(', ') || 'None reported'}
- Smoking: ${patientData.medicalHistory?.socialHistory?.smoking?.status ? `Yes, ${patientData.medicalHistory.socialHistory.smoking.packYears || 0} pack-years` : 'No'}
${patientData.additionalText ? `- Additional Notes: ${patientData.additionalText}` : ''}
`;

    contentParts.push({
      type: "text",
      text: patientContext
    });

    // Add uploaded images if any
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file.type === 'image' && file.data) {
          contentParts.push({
            type: "image_url",
            image_url: {
              url: file.data // base64 data URL
            }
          });
          contentParts.push({
            type: "text",
            text: `[Image: ${file.name}]`
          });
        } else if (file.type === 'pdf' && file.extractedText) {
          contentParts.push({
            type: "text",
            text: `\n--- EXTRACTED FROM PDF: ${file.name} ---\n${file.extractedText}\n--- END PDF ---\n`
          });
        } else if (file.type === 'text' && file.content) {
          contentParts.push({
            type: "text",
            text: `\n--- FROM FILE: ${file.name} ---\n${file.content}\n--- END FILE ---\n`
          });
        }
      }
    }

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contentParts }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let result;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;
      result = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw content:", content);
      throw new Error("Failed to parse clinical analysis response");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-clinical function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
