import axios from 'axios';

export class GeminiService {
    private apiKey: string;
    private apiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
    }

    async getNextAction(pageContext: string, persona: string) {
        const prompt = `You are a ${persona} testing a web application. 
        Page Context: ${pageContext}
        Based on your persona behaviors, what is your next action? 
        Respond in JSON: { "action": "click|type|hover", "selector": "...", "reason": "..." }`;

        try {
            const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });
            // Simplified parsing
            return response.data;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    async generateReport(explorationData: any) {
        const prompt = `Analyze the following UX exploration data and generate a detailed report: ${JSON.stringify(explorationData)}`;
        // Report generation logic here
    }
}
