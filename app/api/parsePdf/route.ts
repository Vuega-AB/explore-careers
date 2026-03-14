import { normalizeText } from '@/lib/utils';
import { NextRequest } from 'next/server';
import pdfParse from 'pdf-parse';

interface PDFParseRequest {
  resumeUrl: string;
  theme?: string;
}

export async function POST(request: NextRequest) {
  const { resumeUrl, theme } = (await request.json()) as PDFParseRequest;
  console.log(`[Parser] Processing resume for user in ${theme} mode`);

  const response = await fetch(resumeUrl);
  const arrayBuffer = await response.arrayBuffer();
  const pdfData = await pdfParse(Buffer.from(arrayBuffer));
  const normalizedText = normalizeText(pdfData.text);

  return new Response(JSON.stringify(normalizedText), {
    status: 200,
  });
}
