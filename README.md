# Hestia Voice AI Workshop

A real-time voice AI agent workshop using LiveKit, Next.js, and PostgreSQL.

## Quick Start

```bash
# Start all services (PostgreSQL, Adminer, Next.js)
docker compose up --build -d

# View logs
docker compose logs -f voice-platform

# Stop services
docker compose down
```

## Services

- **Next.js App:** `http://localhost:3000` — Main workshop application
- **Adminer:** `http://localhost:8081` — Database admin UI
- **PostgreSQL:** `localhost:5432` — Database

## Directory Structure

```
hestia-voice-ai/
├── docker-compose.yml       # Docker orchestration
├── voice-platform/          # Next.js app (API + frontend)
│   ├── app/api/            # API routes
│   ├── lib/                # Prisma client singleton
│   ├── prisma/             # Database schema
│   └── start.sh            # Container startup script
└── worker/                 # LiveKit worker (Python)
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/session` | POST | Create a new session |
| `/api/session/end` | POST | End a session |
| `/api/session/[id]` | GET | Fetch session + events + scores |
| `/api/event` | POST | Log an event |
| `/api/score` | POST | Add score + update session total |

## Database Schema

- **Session:** Voice AI session tracking
- **Event:** Session events (speech, responses, etc.)
- **Score:** Session scoring with reasons

## Development

### Voice Platform (Next.js)

```bash
cd voice-platform
npm install
npx prisma generate
npm run dev
```

### Worker (LiveKit)

```bash
cd worker
# Setup coming soon
```

## Notes

- Database schema uses no foreign keys (workshop-friendly)
- Prisma client is generated automatically in Docker
- Source code is volume-mounted for hot-reload
- Adminer available at `http://localhost:8081` for data inspection
