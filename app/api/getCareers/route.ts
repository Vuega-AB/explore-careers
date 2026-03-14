import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const abacus = new OpenAI({
  baseURL: 'https://routellm.abacus.ai/v1',
  apiKey: process.env.ABACUS_API_KEY,
});

function extractJSON(content: string) {
  try {
    const firstBracket = content.indexOf('{');
    const lastBracket = content.lastIndexOf('}');
    if (firstBracket === -1 || lastBracket === -1) return null;

    let jsonString = content.substring(firstBracket, lastBracket + 1);
    
    // Fix unquoted numbers/ranges (e.g., : 1-4 -> : "1-4")
    jsonString = jsonString.replace(/:\s*(\d+-\d+)/g, ': "$1"');
    
    return JSON.parse(jsonString);
  } catch (e) {
    return null; 
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resumeInfo, context } = await request.json();
    const MODEL_NAME = "llama-3.3-70b-versatile";

    // STAGE 1: THE ARCHITECT (Categorization and Selection)
    const architectPrompt = `
      You are an Enterprise Career Strategist. Analyze the resume and suggest 6 careers.
      STRICT CATEGORIES: [Enterprise Integration, Data Trust, Secure Directory Service, Digital Identity, Business Planning and Forecast, Business Insights, Data Platform, Enterprise Asset Management]
      
      FORMATTING RULES:
      - salary: MUST include "$" and use "k" (e.g., "$120k - $160k")
      - difficulty: MUST be exactly one of these three words: "Low", "Medium", or "High"
      - timeline: e.g. "6-12 Months"
      
      OUTPUT ONLY RAW JSON:
      {
        "careers": [
          {
            "category": "One of the 8 categories",
            "jobTitle": "Title",
            "jobDescription": "Description",
            "timeline": "Timeframe",
            "salary": "Formatted Salary",
            "difficulty": "Low, Medium, or High"
          }
        ]
      }
    `;

    const architectCompletion = await abacus.chat.completions.create({
      messages: [
        { role: 'system', content: architectPrompt },
        { role: 'user', content: `Resume: ${resumeInfo}. Context: ${context}` },
      ],
      model: MODEL_NAME,
      response_format: { type: "json_object" },
    });

    const parsed = extractJSON(architectCompletion.choices[0].message.content!);
    if (!parsed || !parsed.careers) throw new Error("Architect failed to produce valid JSON");
    const careers = parsed.careers;

    // STAGE 2: THE DETAILED PLANNER (Custom Logic & Why it Fits)
    const finalResults = await Promise.all(careers.map(async (career: any) => {
      try {
        const details = await abacus.chat.completions.create({
          messages: [
            { 
              role: 'system', 
              content: `You are an Expert Career Coach and Technical Recruiter. Respond ONLY in JSON. 
              
              CRITICAL INSTRUCTIONS FOR "whyItsagoodfit":
              - You MUST provide 3-4 highly personalized reasons based ONLY on the provided resume.
              - DO NOT use generic phrases like "High market demand" or "Enterprise alignment".
              - INSTEAD, use specific data: "Your experience with [Project Name] is directly applicable," or "Your mastery of [Specific Skill] matches the role's needs."
              - If the resume mentions a specific degree or certification, mention how it qualifies them.` 
            },
            { 
              role: 'user', 
              content: `Analyze the transition into "${career.jobTitle}" for this specific candidate.
              
              Resume Snippet: ${resumeInfo.substring(0, 1200)}
              
              Return JSON: 
              {
                "workRequired": "Short commitment description only 5 words maximum",
                "aboutTheRole": "Deep dive into daily tasks",
                "whyItsagoodfit": ["Specific Reason 1 citing resume", "Specific Reason 2 citing resume", "Specific Reason 3 citing resume"],
                "roadmap": [
                  {"stepTitle": "Week 1-4", "stepDetails": "Description..."},
                  {"stepTitle": "Week 5-8", "stepDetails": "Description..."},
                  {"stepTitle": "Week 9-12", "stepDetails": "Description..."},
                  {"stepTitle": "Week 13-16", "stepDetails": "Description..."}
                ]
              }` 
            }
          ],
          model: MODEL_NAME,
          response_format: { type: "json_object" },
        });

        const detailData = extractJSON(details.choices[0].message.content!);
        return detailData ? { ...career, ...detailData } : career; 
      } catch (e) {
        return career; 
      }
    }));

    return new Response(JSON.stringify(finalResults), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}