# Implementation Plan - UXTestAI

UXTestAI is an autonomous AI software testing platform that explores web applications using custom personas and generates detailed UX reports.

## Proposed Changes

### Project Structure
Organize the project as a monorepo with `frontend` and `backend` directories.

#### [NEW] [frontend/](file:///d:/MOCO_AI/frontend)
React 19, TypeScript, Vite, Tailwind CSS.

#### [NEW] [backend/](file:///d:/MOCO_AI/backend)
Node.js, Express, TypeScript, Prisma (PostgreSQL).

### Core Components

#### [Backend] API & Automation Layer
- **Express Server**: Entry point for requests.
- **Worker System**: Manages Playwright instances for browsing.
- **Persona Engine**: Generates system prompts for Gemini 1.5 Pro to simulate user behavior.
- **Frustration Tracker**: Analyzes Playwright traces and logs for "rage quit" patterns.

#### [Frontend] Dashboard & Reporting
- **Landing Page**: GitHub/Localhost URL input and Persona selection.
- **Testing View**: Real-time status updates and status graph.
- **Report View**: Comprehensive UX score, issue list, and Persona debate visualization.

### Unique Features
1. **Frustration Heatmapping**: Overlay of rapid click areas and mouse hover delays.
2. **Persona Debate Engine**: A simulated dialogue between two AI personas regarding identified issues.
3. **One-Click Fix PRs**: Backend uses Gemini to generate code patches based on UX findings.

## Verification Plan

### Automated Tests
- Playwright-based integration tests for the "happy path" (submit URL -> get report).
- Unit tests for Persona behavioral logic.

### Manual Verification
- Visual inspection of the Landing and Report pages.
- Verifying the creation of a sample GitHub PR from the fix generator.
