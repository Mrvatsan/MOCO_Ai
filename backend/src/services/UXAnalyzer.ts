export interface FrustrationEvent {
    type: 'rapid_click' | 'mouse_still' | 'backtracking';
    timestamp: number;
    x: number;
    y: number;
    duration?: number;
}

export class UXAnalyzer {
    static calculateRageQuitProbability(events: FrustrationEvent[]): number {
        let score = 0;
        const rapidClicks = events.filter(e => e.type === 'rapid_click').length;
        const stalls = events.filter(e => e.type === 'mouse_still' && (e.duration || 0) > 3000).length;
        const backtracks = events.filter(e => e.type === 'backtracking').length;

        score += rapidClicks * 0.2;
        score += stalls * 0.15;
        score += backtracks * 0.1;

        return Math.min(Math.round(score * 100) / 100, 1.0);
    }

    static generateHeatmapData(events: FrustrationEvent[]) {
        return events.map(e => ({ x: e.x, y: e.y, intensity: e.type === 'rapid_click' ? 1.0 : 0.5 }));
    }
}
