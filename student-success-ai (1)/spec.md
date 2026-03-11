# Student Success AI

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Clone of the Student Success AI app at ct4fkoolmrsxe.mocha.app
- Gemini API key configuration at the top of a dedicated `gemini.ts` service file (clearly marked with a comment)
- Roadmap generator: user inputs their goal/field (e.g. "Full Stack Developer", "Data Scientist") and the app calls Gemini to generate a structured learning roadmap
- Regenerate button to re-call Gemini and get a fresh roadmap
- Study plan generator: personalized weekly study plan based on user's goal
- Career guidance section: AI-generated career advice and tips
- Save roadmaps to backend for persistence
- History: view previously generated roadmaps

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store saved roadmaps (title, content, timestamp, userId)
2. Frontend gemini.ts service: GEMINI_API_KEY constant at top (with clear TODO comment), functions: generateRoadmap(goal, field), generateStudyPlan(goal), generateCareerAdvice(goal)
3. Landing/home page: hero section with goal input form
4. Roadmap page: displays generated roadmap as structured cards/timeline, regenerate button, save button
5. History page: list of saved roadmaps
6. Navigation between pages
