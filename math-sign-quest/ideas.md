# Math Sign Quest — Design Brainstorm

## Three possible visual directions

### Theme Name: Crayon Carnival
Very Brief Intro: A bright paper-and-crayon world with chunky shapes, hand-drawn marks, and a sense of playful classroom energy. The interface feels like a cheerful activity sheet brought to life.
Probability: 0.07

### Theme Name: Pocket Arcade
Very Brief Intro: A compact, high-energy game booth with bold scorekeeping, luminous counters, and playful arcade rhythm. It emphasizes speed and achievement without becoming visually noisy.
Probability: 0.03

### Theme Name: Storybook Garden
Very Brief Intro: A calm illustrated meadow where math challenges appear as friendly discoveries, with soft color washes and gentle character-led encouragement. It prioritizes warmth, reassurance, and low-pressure learning.
Probability: 0.08

## Selected Direction: Crayon Carnival

### Design Movement
Playful Swiss modernism crossed with classroom collage: disciplined alignment and strong hierarchy softened by hand-drawn edges, paper textures, and childlike visual marks.

### Core Principles
1. Make every action feel like picking up a colorful game card.
2. Use bold, legible shapes and high-contrast type so children can scan quickly.
3. Celebrate progress with small bursts of motion, not distracting spectacle.
4. Keep the interface kind: mistakes are feedback, never punishment.

### Color Philosophy
The palette is built around a warm paper cream, berry red, sunny yellow, sky blue, and mint green. Each level owns a color cue, while deep plum ink anchors readability. The signature color is **carnival coral**, a lively red-orange that signals action and celebration without looking aggressive.

### Layout Paradigm
A poster-like composition with an offset main card, a left-side progress rail on desktop, and a stacked single-column play surface on mobile. The home screen uses an asymmetrical hero with floating sticker-like panels instead of a generic centered dashboard.

### Signature Elements
- A hand-drawn coral sunburst behind the logo mark.
- Dotted pencil lines and playful “stamp” badges for state changes.
- A question card with a paper-like lift, colored edge tab, and confetti response moments.

### Interaction Philosophy
Buttons should feel pressable and immediate. Choosing a sign produces clear visual feedback, a short encouraging message, and a focused transition to the next question. Keyboard shortcuts 1–4 are supported for accessibility and quick play.

### Animation
Use short springy transforms and opacity changes under 260ms. Progress chips pop in as questions are completed; correct answers trigger a small confetti burst and incorrect answers gently wobble the selected option before showing the right sign. Respect reduced-motion preferences.

### Typography System
Display: **Baloo 2** for warm, rounded headlines and playful score moments. Body: **Nunito Sans** for clarity at small sizes. Use heavy display weights for titles, 700 for buttons and labels, and 600 for supporting copy.

### Brand Essence
A fast, friendly sign-guessing game that helps children build mental-math confidence one cheerful question at a time. Personality: **joyful, encouraging, energetic**.

### Brand Voice
Headlines sound like an invitation to play, CTAs sound active and specific, and microcopy celebrates thinking rather than speed alone.
Example headline: “Which sign makes it click?”
Example CTA: “Pick a sign and score a star.”

### Wordmark & Logo
The wordmark uses a custom rounded lockup with the “+” and “×” symbols tucked into the letter rhythm. The mark is a four-point coral sunburst with a small negative-space equals sign, designed to work alone as the favicon and app badge.

### Signature Brand Color
**Carnival Coral — #F36A5A**

## Build Notes
- The functional experience is a React web app rather than a 3D engine because the game is a timed, choice-based learning quiz.
- Levels: Easy, Medium, Hard. Each has 10 generated questions and a visible per-question timer.
- Mobile-first behavior: the desktop rail collapses into a compact progress row, and answer choices remain thumb-friendly.
- Generated visual assets should be used only for the brand mark and subtle background decorative art; gameplay content stays HTML for crisp readability and accessibility.

## Style Decisions

- The coral sunburst/equation-symbol mark is a repeatable brand stamp: it appears in the header, the how-to-play panel, the favicon, and celebration moments.
- Functional cards retain handmade classroom-collage cues through offset shadows, colored edge shapes, stamp badges, pencil-like marks, and imperfect symbol chips.
- The four math symbols (+, −, ×, ÷) recur as collectible visual pieces on level cards, the how-to-play panel, and gameplay controls.
