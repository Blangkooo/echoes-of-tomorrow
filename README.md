# Echoes of Tomorrow

A futuristic platform where users communicate with their future selves.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — animations
- **Zustand** — state management (with persistence)
- **Recharts** — analytics charts
- **Radix UI** — accessible primitives
- **shadcn/ui** style components (built from scratch)

---

## Setup

### Prerequisites

Install Node.js 20+ from https://nodejs.org

### Install & Run

```bash
cd echoes-of-tomorrow
npm install
npm run dev
```

Open http://localhost:3000

### Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
echoes-of-tomorrow/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles + CSS variables
│   └── dashboard/
│       ├── layout.tsx          # Dashboard shell (sidebar + starfield)
│       ├── page.tsx            # Dashboard overview
│       ├── timeline/page.tsx   # Future timeline
│       ├── echoes/page.tsx     # All echoes with filters
│       ├── future-self/page.tsx# AI chat with future self
│       ├── capsules/page.tsx   # Time capsules
│       ├── universes/page.tsx  # Parallel universes
│       └── analytics/page.tsx  # Growth analytics
├── components/
│   ├── ui/                     # Design system primitives
│   ├── layout/                 # Sidebar, Header, Starfield
│   ├── echoes/                 # Echo cards and creation modal
│   ├── future-self/            # Chat interface
│   ├── capsules/               # Capsule cards and creation
│   ├── universes/              # Universe cards
│   ├── timeline/               # Timeline visualization
│   ├── analytics/              # Recharts components
│   └── gamification/           # Achievement cards
├── store/
│   └── useAppStore.ts          # Zustand store (persisted)
├── types/
│   └── index.ts                # All TypeScript types
├── lib/
│   ├── utils.ts                # Helpers, formatters, config
│   ├── sampleData.ts           # Rich demo content
│   └── mockAI.ts               # AI response generation
└── hooks/
    └── useTypewriter.ts        # Typewriter animation hook
```

---

## Features

### Core Experience
- **Living Timeline** — echoes placed across your life from today to your predicted future
- **Echo Types** — messages, predictions, dreams, challenges, goals, memories, questions
- **Glassmorphism UI** with animated starfield background

### Future Self Simulator
- Real-time AI chat with a simulated version of your future self
- Contextual, emotionally resonant responses based on message content
- Typing indicators, message history, suggested questions

### Time Capsules
- Lock messages for 1 month / 1 year / 5 years / 10 years
- On unlock: AI reflection, growth comparison, milestone summary
- Visual sealed/unsealed states with blur effects

### Parallel Universe Generator
- Create branching alternate life timelines
- Timeline events, decision points, probability scores
- Public/private visibility toggle
- Rich gradient header cards

### Analytics Dashboard
- Goal completion trend (area chart)
- Emotional wellbeing trend
- Weekly activity (bar chart)
- Future confidence score history
- Echo breakdown by type (pie chart)
- Activity summary stats

### Gamification
- Legacy Points earned per action
- Levels with progress tracking
- 8 achievements across 5 categories
- Daily streak tracking
- Profile titles (The Visionary, etc.)

---

## State Management

All state is managed by Zustand with localStorage persistence. The store handles:
- Echo CRUD + pin/unpin + future response generation
- Capsule creation and unlocking
- Parallel universe management
- Chat message history
- User profile and gamification

---

## Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel --prod
```

### Other platforms
```bash
npm run build
# Deploy the .next folder
```
