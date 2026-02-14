import { NextRequest } from 'next/server';
import OpenAI from 'openai';

// 1. Updated to point to Groq
const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

interface GetCareersRequest {
  resumeInfo: string;
  context: string;
}

export async function POST(request: NextRequest) {
  try {
    const { resumeInfo, context } = (await request.json()) as GetCareersRequest;

    // First Call: Get the list of 6 careers
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a career expert. You MUST respond with a JSON array of 6 objects. No text before or after the JSON.',
        },
        {
          role: 'user',
          content: `Give me 6 career paths based on this resume: ${resumeInfo}. Context: ${context}. 
          Respond in this JSON format: [{"jobTitle": "string", "jobDescription": "string", "timeline": "string", "salary": "string", "difficulty": "string"}]`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" }, // Ensures valid JSON
    });

    const content = chatCompletion.choices[0].message.content;
    // Handle Groq potentially wrapping the array in an object
    const parsed = JSON.parse(content!);
    const careerInfoJSON = Array.isArray(parsed) ? parsed : Object.values(parsed)[0];

    if (!Array.isArray(careerInfoJSON)) {
        throw new Error("AI did not return an array");
    }

    // Second Step: Get details for each career in parallel
    let finalResults = await Promise.all(
      careerInfoJSON.map(async (career: any) => {
        try {
          const completion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are a career expert. Respond ONLY in JSON.',
              },
              {
                role: 'user',
                content: `Provide a roadmap for becoming a ${career.jobTitle}.
                Return JSON: {"workRequired": "string", "aboutTheRole": "string", "whyItsagoodfit": ["string"], "roadmap": [{"Week 1-2": "string"}]}`,
              },
            ],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: "json_object" },
          });

          const specificContent = completion.choices[0].message.content;
          const specificCareerJSON = JSON.parse(specificContent!);

          return { ...career, ...specificCareerJSON };
        } catch (error) {
          console.error('Error fetching details for:', career.jobTitle, error);
          return career; // Return basic info if detail fetch fails
        }
      })
    );

    return new Response(JSON.stringify(finalResults), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}