# Arena — Tournament Portal

A role-aware esports and competitive gaming tournament portal built with React, TypeScript, Tailwind CSS v4, Vite, and Express.

## Features

- **Role-Based Portal**: Sign in or switch live between **Organizer**, **Player**, and **Spectator** views.
- **Dashboard**: Real-time overview of active tournaments, prize pools, registered teams, and recent activity.
- **Tournaments**: Create tournaments, track registration capacity, filter status, and toggle brackets between upcoming, live, and completed.
- **Teams & Rosters**: Register teams against tournaments with tag codes and dynamic player rosters.
- **Matches & Scoring**: Schedule matchups, enter live scores, finalize results, and reopen matches as needed.
- **Standings Leaderboard**: Automatically computes matches played, wins, losses, draws, and points (`3` for win, `1` for draw).
- **Live Activity Feed**: Chronological log of tournament creations, team registrations, match schedules, and results.

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Local Development

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking & Production Build

```bash
npm run lint
npm run build
NODE_ENV=production npm start
```

### Health Check

The Express server exposes `GET /api/health` for load balancers and container orchestrators.

### Docker Deployment

```bash
docker build -t arena-tournament-portal .
docker run -p 3000:3000 arena-tournament-portal
```

## Git Workflow

This repository includes `.gitignore` configured to exclude `node_modules/`, `dist/`, `.env*` (except `.env.example`), and build artifacts.

```bash
git add .
git commit -m "Initial commit: Arena Tournament Portal"
```
