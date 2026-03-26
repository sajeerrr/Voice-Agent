# Meeting Agents AI

A multi-agent AI system that converts meeting notes into structured action items, schedules them in Google Calendar, and sends personalized emails to attendees.

---

## Setup

```bash
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python meeting_agents.py
```

---

## Requirements

| Tool                | Purpose          |
| ------------------- | ---------------- |
| Python 3            | Core runtime     |
| Groq API            | LLM processing   |
| Google Calendar API | Event scheduling |
| Gmail SMTP          | Email sending    |

---

## Folder Layout

```
agenticai/
├── meeting_agents.py      # Main multi-agent script
├── .env                   # API keys (ignored)
├── credentials.json       # Google OAuth (ignored)
├── token.json             # Auth token (auto-generated)
├── meeting_output.txt     # Generated output
├── .gitignore
└── venv/
```

---

## Workflow

1. User inputs:

   * Email credentials
   * Attendees
   * Meeting notes

2. Agents process:

   * **Agent 1** → Summarize notes
   * **Agent 2** → Extract action items
   * **Agent 3** → Assign priorities
   * **Agent 4** → Generate messages

3. System actions:

   * 📅 Create Google Calendar events
   * 📨 Send emails to attendees
   * 📝 Save results to file

---

## Example Output

```bash
📅 Sajeer — Fix login bug
🕖 7:00 PM – 8:00 PM
📆 27 March 2026
```

---

## Environment Variables

Create a `.env` file:

```env
API_KEY=your_groq_api_key
```

---

## Google Calendar Setup

1. Go to Google Cloud Console
2. Enable Google Calendar API
3. Download `credentials.json`
4. Place it in project root
5. Run app → login once → `token.json` auto-created

---

## Things to Know

* Uses multi-agent architecture for task automation
* Deadlines are parsed into real date-time events
* OAuth is cached using `token.json`
* `.env`, `credentials.json`, and `token.json` must NOT be committed

---

## Future Improvements

* Smart scheduling (avoid time conflicts)
* JSON-based structured outputs
* Voice input support
* Desktop UI (Tauri / Electron)
* SaaS deployment

---
