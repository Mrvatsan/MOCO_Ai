import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { GeminiService } from './services/GeminiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

dotenv.config();

// --- Initialize Prisma ---
let prisma: any;
try {
    const dbPath = path.resolve(__dirname, '../dev.db');
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
    prisma = new PrismaClient({ adapter });
    console.log('✅ Prisma initialized successfully');
} catch (e: any) {
    console.error('❌ Prisma initialization failed:', e.message || e);
}

// --- Initialize Gemini ---
let geminiService: GeminiService | null = null;
try {
    geminiService = new GeminiService();
    console.log('✅ Gemini AI service initialized');
} catch (e: any) {
    console.error('❌ Gemini initialization failed:', e.message || e);
}

// --- Express App ---
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        prisma: !!prisma,
        gemini: !!geminiService,
        timestamp: new Date()
    });
});

// --- Start a Testing Session ---
app.post('/api/sessions', async (req, res) => {
    const { url, persona } = req.body;
    console.log(`\n🚀 New audit session: url=${url}, persona=${persona}`);

    if (!url || !persona) {
        return res.status(400).json({ error: 'URL and persona are required' });
    }
    if (!prisma) {
        return res.status(500).json({ error: 'Database not available' });
    }
    if (!geminiService) {
        return res.status(500).json({ error: 'AI engine not available. Check GEMINI_API_KEY.' });
    }

    try {
        // 1. Create session in DB
        const session = await prisma.session.create({
            data: { url, persona, status: 'pending' }
        });
        console.log(`📝 Session created: ${session.id}`);

        // 2. Return immediately so the frontend can start polling
        res.status(201).json(session);

        // 3. Run analysis in the background
        runAnalysis(session.id, url, persona).catch(err => {
            console.error(`❌ Background analysis failed for ${session.id}:`, err.message);
        });
    } catch (error: any) {
        console.error('Failed to create session:', error.message || error);
        res.status(500).json({ error: 'Failed to create session', details: error.message });
    }
});

// --- Background Analysis Function ---
async function runAnalysis(sessionId: string, url: string, persona: string) {
    try {
        // Update status to exploring
        await prisma.session.update({
            where: { id: sessionId },
            data: { status: 'exploring', progress: 20 }
        });
        console.log(`🔍 [${sessionId}] Fetching and analyzing ${url}...`);

        // Update status to generating
        await prisma.session.update({
            where: { id: sessionId },
            data: { status: 'generating', progress: 50 }
        });

        // Call Gemini for analysis
        const analysisResult = await geminiService!.analyzeUrl(url, persona);
        console.log(`🧠 [${sessionId}] AI analysis complete. UX Score: ${analysisResult.uxScore}`);

        // Update progress
        await prisma.session.update({
            where: { id: sessionId },
            data: { progress: 80 }
        });

        // Save report to DB
        const report = await prisma.report.create({
            data: {
                sessionId,
                uxScore: Math.round(analysisResult.uxScore),
                summary: analysisResult.summary,
                personaDebate: JSON.stringify(analysisResult.debate),
                frustrationData: JSON.stringify({
                    rageQuitProb: analysisResult.rageQuitProb
                }),
                issues: {
                    create: analysisResult.issues.map(issue => ({
                        severity: issue.severity,
                        title: issue.title,
                        description: issue.description,
                        fixCode: issue.fixCode
                    }))
                }
            }
        });
        console.log(`💾 [${sessionId}] Report saved: ${report.id}`);

        // Mark session as completed
        await prisma.session.update({
            where: { id: sessionId },
            data: { status: 'completed', progress: 100 }
        });
        console.log(`✅ [${sessionId}] Session completed successfully!`);

    } catch (error: any) {
        console.error(`❌ [${sessionId}] Analysis failed:`, error.message);
        await prisma.session.update({
            where: { id: sessionId },
            data: { status: 'failed', progress: 0 }
        }).catch(() => { });
    }
}

// --- Get Session Status + Report ---
app.get('/api/sessions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const session = await prisma.session.findUnique({
            where: { id },
            include: { report: { include: { issues: true } } }
        });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        // Parse JSON fields for the response
        if (session.report) {
            try {
                session.report.personaDebate = typeof session.report.personaDebate === 'string'
                    ? JSON.parse(session.report.personaDebate)
                    : session.report.personaDebate;
                session.report.frustrationData = typeof session.report.frustrationData === 'string'
                    ? JSON.parse(session.report.frustrationData)
                    : session.report.frustrationData;
            } catch { }
        }

        res.json(session);
    } catch (error: any) {
        console.error('Failed to fetch session:', error.message);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

app.listen(PORT, () => {
    console.log(`\n🌐 Backend running on http://localhost:${PORT}`);
    console.log(`   Prisma: ${prisma ? '✅' : '❌'}  |  Gemini: ${geminiService ? '✅' : '❌'}\n`);
});
