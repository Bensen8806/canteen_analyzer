# AI Canteen Feedback Analyzer

## Project Overview
The AI Canteen Feedback Analyzer is a premium, interactive web application that allows users to view a catalog of canteen food items and provide detailed feedback. The architecture is designed to be highly scalable, specifically preparing for future integrations of AI features like sentiment analysis, LLM-based insight generation, and dynamic recommendations.

## Technology Stack
- **Framework:** Next.js (App Router)
- **Library:** React
- **Styling:** Vanilla CSS / CSS Modules
- **State Management:** React Context or Zustand
- **Icons:** Lucide React

## Design & Aesthetics Guidelines
**CRITICAL RULE:** Do NOT use TailwindCSS unless explicitly requested by the user. If requested, always confirm the version first.
- **Visual Excellence:** The application must look premium and state-of-the-art. Avoid generic color palettes (e.g., plain red/blue). Instead, use curated, harmonious color palettes (HSL tailored colors, sleek dark modes).
- **Typography:** Use modern web fonts (e.g., Inter, Roboto, Outfit) instead of browser defaults.
- **Dynamic Interfaces:** Rely heavily on micro-animations, smooth hover states, and glassmorphism to create a responsive, lively user experience.
- **Components:** Maintain a modular component architecture. Components should use predefined design system tokens (via CSS variables in `globals.css`) rather than ad-hoc utility classes.

## Development Workflow
1. **Plan:** Understand requirements and draw inspiration from modern web designs.
2. **Foundation:** Implement/modify `globals.css` with a robust design system (tokens, utilities).
3. **Components:** Build focused, reusable components.
4. **Assembly:** Assemble pages with responsive layouts and proper routing.
5. **Polish:** Optimize for UX, smooth transitions, and SEO best practices (Title tags, Meta descriptions, Semantic HTML).

## AI Scalability Considerations
- Ensure data payloads for feedback (e.g., ratings, text, tags, item IDs, timestamps) are structured richly to allow seamless consumption by future LLM integrations.
- Abstract API calls (e.g., `submitFeedback`) into a service layer so they can be easily replaced or augmented with AI processing backends in the future.
