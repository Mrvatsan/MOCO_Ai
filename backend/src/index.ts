import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Status check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Start a testing session
app.post('/api/sessions', async (req, res) => {
    const { url, persona } = req.body;
    try {
        const session = await prisma.session.create({
            data: { url, persona }
        });
        // TRIGGER BACKGROUND WORKER HERE
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// Get session status
app.get('/api/sessions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const session = await prisma.session.findUnique({
            where: { id },
            include: { report: { include: { issues: true } } }
        });
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
