import os
from livekit import agents, rtc
from livekit.agents import AgentServer, AgentSession, Agent, room_io, TurnHandlingOptions
from livekit.plugins import noise_cancellation, silero, deepgram, groq
from livekit.plugins.turn_detector.multilingual import MultilingualModel

from config import settings


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a helpful voice AI assistant.
            You eagerly assist users with their questions by providing information from your extensive knowledge.
            Your responses are concise, to the point, and without any complex formatting or punctuation including emojis, asterisks, or other symbols.
            You are curious, friendly, and have a sense of humor.""",
        )

server = AgentServer()

@server.rtc_session()
async def my_agent(ctx: agents.JobContext):
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

        turn_handling=TurnHandlingOptions(
            turn_detection=MultilingualModel(),
        ),
    )

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


if __name__ == "__main__":
    agents.cli.run_app(server)