import { chromium, type Browser, type Page } from 'playwright';

export class PlaywrightController {
    private browser: Browser | null = null;

    async init() {
        this.browser = await chromium.launch({ headless: true });
    }

    async explore(url: string, personaPrompt: string) {
        if (!this.browser) await this.init();
        const context = await this.browser!.newContext({
            recordVideo: { dir: './videos/' },
            viewport: { width: 1280, height: 720 }
        });
        const page = await context.newPage();

        try {
            await page.goto(url, { waitUntil: 'networkidle' });
            // Logic for Persona-driven exploration will be integrated here
            // using the Gemini API to decide next actions based on page state.

            const screenshot = await page.screenshot({ fullPage: true });
            return { screenshot, videoPath: await page.video()?.path() };
        } finally {
            await context.close();
        }
    }

    async close() {
        if (this.browser) await this.browser.close();
    }
}
