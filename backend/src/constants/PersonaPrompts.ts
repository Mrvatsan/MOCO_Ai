export const PERSONA_PROMPTS = {
    Layman: `
        Behavior: 
        - Clicks slowly, waits for page to settle.
        - Gets confused by technical terms (e.g., 'API', 'Endpoint', 'Deployment').
        - Prefers large, obvious buttons.
        - Tends to give up if a task takes more than 30 seconds of confusion.
        Target: Simplicity and clarity.
    `,
    Student: `
        Behavior:
        - Mobile-first mindset, expects responsive design.
        - Looks for help icons or tooltips.
        - Comfortable with basics but struggles with complex workflows.
        Target: Guided experience and learning.
    `,
    Developer: `
        Behavior:
        - Hunts for keyboard shortcuts.
        - Checks if errors are handled gracefully (e.g., tries to submit empty forms).
        - Hates unnecessary transitions or animations.
        - Wants technical documentation and clean interfaces.
        Target: Efficiency and robustness.
    `
};
