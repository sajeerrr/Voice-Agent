import asyncio
import json
import os
from urllib import error, parse, request

from livekit import agents, rtc
from livekit.agents import AgentServer, AgentSession, Agent, room_io
from livekit.plugins import noise_cancellation, silero, deepgram, groq

from config import settings

AGENT_NAME = "voice-assistant"
VOICE_PLATFORM_URL = os.getenv("VOICE_PLATFORM_URL", "http://voice-platform:3000")


def _request_json(url: str, *, method: str = "GET", payload: dict | None = None) -> dict:
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = request.Request(url, data=data, headers=headers, method=method)
    with request.urlopen(req, timeout=10) as response:
        body = response.read().decode("utf-8")
        return json.loads(body) if body else {}


async def get_session_id(room_id: str) -> str | None:
    room_path = parse.quote(room_id, safe="")
    url = f"{VOICE_PLATFORM_URL}/api/session/room/{room_path}"

    try:
        session = await asyncio.to_thread(_request_json, url)
    except error.HTTPError as exc:
        print(f"Failed to find session for room {room_id}: HTTP {exc.code}")
        return None
    except Exception as exc:
        print(f"Failed to find session for room {room_id}: {exc}")
        return None

    session_id = session.get("id")
    return session_id if isinstance(session_id, str) else None


async def save_message(session_id: str, role: str, content: str) -> None:
    cleaned = content.strip()
    if not cleaned:
        return

    url = f"{VOICE_PLATFORM_URL}/api/session/{session_id}/message"

    try:
        await asyncio.to_thread(
            _request_json,
            url,
            method="POST",
            payload={"role": role, "content": cleaned},
        )
    except Exception as exc:
        print(f"Failed to save transcript message for session {session_id}: {exc}")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a helpful voice AI assistant.
            You eagerly assist users with their questions by providing information from your extensive knowledge.
            Your responses are concise, to the point, and without any complex formatting or punctuation including emojis, asterisks, or other symbols.
            You are curious, friendly, and have a sense of humor.""",
        )

server = AgentServer()

@server.rtc_session(agent_name=AGENT_NAME)
async def my_agent(ctx: agents.JobContext):
    session_id = await get_session_id(ctx.room.name)
    transcript_tasks: set[asyncio.Task[None]] = set()

    def track_task(task: asyncio.Task[None]) -> None:
        transcript_tasks.add(task)
        task.add_done_callback(transcript_tasks.discard)

    # Create session
    session = AgentSession(
        stt=deepgram.STT(
            model="nova-3",
            language="en-IN",
            api_key=settings.DEEPGRAM_API_KEY,
        ),

        llm=groq.LLM(
            model="llama-3.3-70b-versatile",
            api_key=settings.GROQ_API_KEY,
        ),

        tts=deepgram.TTS(
            model="aura-asteria-en",  # or choose another voice
            api_key=settings.DEEPGRAM_API_KEY,
        ),

        vad=silero.VAD.load(),
    )

    @session.on("conversation_item_added")
    def on_conversation_item_added(event) -> None:
        if session_id is None:
            return

        role = event.item.role
        if role not in {"user", "assistant"}:
            return

        text = (event.item.text_content or "").strip()
        if not text:
            return

        track_task(asyncio.create_task(save_message(session_id, role, text)))

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: noise_cancellation.BVCTelephony() if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP else noise_cancellation.BVC(),
            ),
        ),
    )

    await session.generate_reply(
        instructions="Greet the user and offer your assistance."
    )

    if transcript_tasks:
        await asyncio.gather(*transcript_tasks, return_exceptions=True)


if __name__ == "__main__":
    agents.cli.run_app(server)
