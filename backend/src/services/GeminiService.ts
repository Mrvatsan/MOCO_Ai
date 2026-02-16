import { GoogleGenerativeAI } from '@google/generative-ai';
import { PERSONA_PROMPTS } from '../constants/PersonaPrompts.js';

export interface AnalysisResult {
    uxScore: number;
    summary: string;
    rageQuitProb: number;
    issues: {
        severity: 'critical' | 'medium' | 'low';
        title: string;
        description: string;
        fixCode: string | null;
    }[];
    debate: {
        persona?: string;
        winner?: string;
        comment?: string;
        resolution?: string;
        icon: string;
    }[];
}

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    }

    async fetchPageContent(url: string): Promise<string> {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                signal: AbortSignal.timeout(15000)
            });
            const html = await response.text();
            // Strip scripts, styles, and excessive whitespace; keep meaningful content
            const cleaned = html
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .replace(/<style[\s\S]*?<\/style>/gi, '')
                .replace(/<svg[\s\S]*?<\/svg>/gi, '[SVG_ICON]')
                .replace(/<!--[\s\S]*?-->/g, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            // Limit to ~12000 chars to fit in context window
            return cleaned.substring(0, 12000);
        } catch (error: any) {
            console.error('Failed to fetch page:', error.message);
            throw new Error(`Could not fetch the page at ${url}: ${error.message}`);
        }
    }

    async analyzeUrl(url: string, persona: string): Promise<AnalysisResult> {
        console.log(`[GeminiService] Fetching page content from: ${url}`);
        const pageContent = await this.fetchPageContent(url);
        console.log(`[GeminiService] Page content fetched (${pageContent.length} chars). Sending to Gemini...`);

        const personaPrompt = (PERSONA_PROMPTS as any)[persona] || PERSONA_PROMPTS.Layman;

        const prompt = `You are an expert UX auditor. Analyze the following web page from the perspective of a "${persona}" user.

## Persona Behavior Profile:
${personaPrompt}

## Web Page URL: ${url}

## Extracted Page Content:
${pageContent}

## Your Task:
Analyze the UX of this web application thoroughly. Consider navigation, clarity, accessibility, visual design, content quality, and user flow. Be SPECIFIC to this actual page content — reference real elements, text, and features you see in the extracted content.

## Response Format (STRICT JSON — no markdown, no code fences):
{
    "uxScore": <number 1-10, be honest and fair>,
    "summary": "<2-3 sentence overall assessment specific to THIS page>",
    "rageQuitProb": <number 0.0-1.0, probability a user of this persona would abandon the site>,
    "issues": [
        {
            "severity": "<critical|medium|low>",
            "title": "<short issue title>",
            "description": "<specific description referencing actual page elements>",
            "fixCode": "<concrete fix suggestion or null>"
        }
    ],
    "debate": [
        { "persona": "Layman", "comment": "<what a layman would say about this site>", "icon": "👨‍💼" },
        { "persona": "Student", "comment": "<what a student would say>", "icon": "🎓" },
        { "persona": "Developer", "comment": "<what a developer would say>", "icon": "💻" },
        { "winner": "AI Vote", "resolution": "<final AI verdict synthesizing all perspectives>", "icon": "🤖" }
    ]
}

IMPORTANT: 
- Return ONLY valid JSON, no markdown formatting, no \`\`\` fences.
- Generate 3-6 issues based on what you actually see in the page content.
- Be specific to THIS page — do NOT make up features that don't exist.
- All persona comments in the debate must reference real elements from the page.`;

        // Retry logic for rate limiting
        const maxRetries = 5;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[GeminiService] Attempt ${attempt}/${maxRetries}...`);
                const result = await this.model.generateContent(prompt);
                const responseText = result.response.text();
                console.log('[GeminiService] Gemini response received, parsing...');

                // Clean potential markdown code fences from response
                const cleanedResponse = responseText
                    .replace(/```json\s*/gi, '')
                    .replace(/```\s*/gi, '')
                    .trim();

                const parsed: AnalysisResult = JSON.parse(cleanedResponse);

                // Validate and clamp values
                parsed.uxScore = Math.max(1, Math.min(10, Math.round(parsed.uxScore * 10) / 10));
                parsed.rageQuitProb = Math.max(0, Math.min(1, Math.round(parsed.rageQuitProb * 100) / 100));

                if (!Array.isArray(parsed.issues)) parsed.issues = [];
                if (!Array.isArray(parsed.debate)) parsed.debate = [];

                console.log(`[GeminiService] Analysis complete: UX Score = ${parsed.uxScore}, Issues = ${parsed.issues.length}`);
                return parsed;
            } catch (error: any) {
                const msg = error.message || '';
                const isRateLimit = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('retry');
                if (isRateLimit && attempt < maxRetries) {
                    // Parse the exact retryDelay from Gemini's error response
                    const retryMatch = msg.match(/retryDelay["\s:]+(\d+)/);
                    const delay = retryMatch ? (parseInt(retryMatch[1]) + 5) * 1000 : 30000;
                    console.log(`[GeminiService] Rate limited. Waiting ${delay / 1000}s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                console.error('[GeminiService] Gemini analysis failed:', msg);
                throw new Error(`AI analysis failed: ${msg}`);
            }
        }
        throw new Error('AI analysis failed after all retries');
    }
}
