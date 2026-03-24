# Voice Agent

A workshop project for building real-time voice AI agents with LiveKit, Next.js, and PostgreSQL.

---

## Setup
```bash
docker compose up --build -d           # Build and start
docker compose logs -f voice-platform  # Follow logs
docker compose down                    # Tear down
```

---

## Running Services

| Service     | Address                  | Purpose          |
|-------------|--------------------------|------------------|
| App         | `http://localhost:3000`  | Next.js frontend |
| DB Admin    | `http://localhost:8081`  | Adminer UI       |
| Database    | `localhost:5432`         | PostgreSQL       |

---

## Folder Layout
```
voice-agent/
├── docker-compose.yml
├── voice-platform/
│   ├── app/api/        # Route handlers
│   ├── lib/            # Prisma singleton
│   ├── prisma/         # Schema definition
│   └── start.sh        # Boot script
└── worker/             # Python LiveKit worker
```

---

## API Endpoints

| Route                | Method | Action                          |
|----------------------|--------|---------------------------------|
| `/api/session`       | POST   | Start a new session             |
| `/api/session/end`   | POST   | Close an active session         |
| `/api/session/[id]`  | GET    | Get session details and scores  |
| `/api/event`         | POST   | Record a session event          |
| `/api/score`         | POST   | Submit score and update total   |

---

## Data Models

- **Session** — tracks each voice AI conversation
- **Event** — captures in-session activity (speech, responses)
- **Score** — stores ratings and reasons per session

---

## Dev Setup

**Next.js Platform**
```bash
cd voice-platform
npm install
npx prisma generate
npm run dev
```

**LiveKit Worker**
```bash
cd worker
# Coming soon
```

---

## Things to Know

- Schema has no foreign keys — keeps it simple for workshops
- Prisma generates automatically inside Docker
- Hot-reload enabled via volume mounting
