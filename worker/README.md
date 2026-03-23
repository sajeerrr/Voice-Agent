# Hestia Voice AI Worker

A LiveKit-based voice AI assistant worker that provides real-time conversational AI capabilities with speech-to-text, text-to-speech, and intelligent language model integration.

## Features

- **Real-time Voice Processing**: Speech-to-text and text-to-speech using Deepgram
- **Intelligent Conversation**: Powered by Groq's LLaMA-3.3-70B-Versatile model
- **Noise Cancellation**: Advanced audio noise reduction for clear communication
- **Turn Detection**: Multilingual turn detection for natural conversation flow
- **Voice Activity Detection**: Silero VAD for accurate speech detection
- **Multi-language Support**: Configurable language settings

## Architecture

The worker is built using LiveKit Agents framework and integrates multiple AI services:

- **STT/TTS**: Deepgram Nova-3 model with Aura Asteria voice
- **LLM**: Groq LLaMA-3.3-70B-Versatile
- **VAD**: Silero Voice Activity Detection
- **Noise Cancellation**: BVCTelephony for SIP, BVC for regular participants

## Prerequisites

- Python 3.12 or higher
- Poetry for dependency management
- Valid API keys for all required services
- Git (for cloning the repository)

## Installation

### 1. Install Python 3.12+

**macOS (using Homebrew):**
```bash
brew install python@3.12
```

**macOS (using pyenv):**
```bash
brew install pyenv
pyenv install 3.12.0
pyenv global 3.12.0
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3.12 python3.12-pip python3.12-venv
```

**Windows (using winget):**
```bash
winget install Python.Python.3.12
```

Verify Python installation:
```bash
python --version
# Should show Python 3.12.x
```

### 2. Install Poetry

**Recommended Method (Official Installer):**
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

**Alternative Methods:**

**macOS (Homebrew):**
```bash
brew install poetry
```

**Windows (PowerShell):**
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python3 -
```

**pip (not recommended, but possible):**
```bash
pip install poetry
```

### 3. Configure Poetry

Add Poetry to your PATH (if not automatically added):

**macOS/Linux (bash/zsh):**
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
# or for zsh:
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.bashrc  # or source ~/.zshrc
```

**Windows:**
Add `%APPDATA%\Python\Scripts` to your PATH environment variable.

Verify Poetry installation:
```bash
poetry --version
# Should show Poetry version
```

### 4. Configure Poetry Settings

Configure Poetry to create virtual environments in the project directory (recommended):
```bash
poetry config virtualenvs.in-project true
```

Configure Poetry to not search PyPI for packages (optional, for faster installs):
```bash
poetry config pypi-token.pypi your-pypi-token-if-needed
```

### 5. Clone and Set Up the Project

1. Clone the repository:
```bash
git clone <repository-url>
cd worker
```

2. Install dependencies using Poetry:
```bash
poetry install
```

This will:
- Create a virtual environment in the project (`.venv/`)
- Install all dependencies from `pyproject.toml`
- Install development dependencies if specified

3. Verify the installation:
```bash
poetry run python --version
# Should show Python 3.12.x

poetry run pip list
# Should show all installed packages
```

### 6. Set Up Environment Variables

1. Create a `.env` file from the sample:
```bash
cp env_sample .env
```

2. Configure your environment variables in `.env`:
```env
LIVEKIT_URL=<your-livekit-url>
LIVEKIT_API_KEY=<your-livekit-api-key>
LIVEKIT_API_SECRET=<your-livekit-api-secret>

# STT, TTS API Key
DEEPGRAM_API_KEY=<your-deepgram-api-key>

# LLM API Key
GROQ_API_KEY=<your-groq-api-key>
```

### 7. Verify Setup

Test that all dependencies are working:
```bash
poetry run python -c "import livekit.agents; print('LiveKit agents imported successfully')"
poetry run python -c "from livekit.plugins import deepgram, groq; print('Plugins imported successfully')"
poetry run python -c "from config import settings; print('Configuration loaded successfully')"
```

### Troubleshooting Installation

**Poetry not found:**
- Restart your terminal after installation
- Verify Poetry is in your PATH: `which poetry`
- Try the manual installation method

**Python version issues:**
- Ensure Python 3.12+ is the default: `python --version`
- Use `pyenv` to manage multiple Python versions
- Update Poetry's Python requirement in `pyproject.toml` if needed

**Permission issues:**
- Don't use `sudo` with Poetry (it's designed for user-level installation)
- Check file permissions in your home directory
- Try installing Poetry in a different location

**Virtual environment issues:**
- Delete `.venv/` directory and run `poetry install` again
- Check that Python 3.12+ is available: `poetry env info`
- Force recreation: `poetry env remove python && poetry install`

## Usage

### Running the Worker

**Development Mode:**
```bash
poetry run python agent_worker.py dev
```

**Production Mode:**
```bash
poetry run python agent_worker.py
```

The worker will connect to your LiveKit server and be available to handle voice sessions. Use the `dev` flag for development to enable additional logging and debugging features.

### Configuration

The worker can be configured through environment variables or by modifying the `config.py` file:

- `LIVEKIT_URL`: Your LiveKit server URL
- `LIVEKIT_API_KEY`: LiveKit API key
- `LIVEKIT_API_SECRET`: LiveKit API secret
- `DEEPGRAM_API_KEY`: Deepgram API key for STT/TTS
- `GROQ_API_KEY`: Groq API key for LLM

### Customization

#### Agent Personality
Modify the `Assistant` class in `agent_worker.py` to customize the AI's personality and behavior:

```python
class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""Your custom instructions here...""",
        )
```

#### Voice Settings
Change the TTS voice model in the session configuration:

```python
tts=deepgram.TTS(
    model="aura-asteria-en",  # Change to preferred voice
    api_key=settings.DEEPGRAM_API_KEY,
),
```

#### Language Settings
Update the STT language model:

```python
stt=deepgram.STT(
    model="nova-3",
    language="multi",  # Change to specific language if needed
    api_key=settings.DEEPGRAM_API_KEY,
),
```

## API Keys Setup

### LiveKit
1. Create a LiveKit account at [livekit.io](https://livekit.io)
2. Set up a project and obtain your URL, API key, and secret

### Deepgram
1. Sign up at [deepgram.com](https://deepgram.com)
2. Create an API key for STT/TTS services

### Groq
1. Register at [groq.com](https://groq.com)
2. Get your API key for LLM access

## Dependencies

Key dependencies include:
- `livekit-agents`: Core LiveKit agents framework
- `livekit-plugins-deepgram`: Deepgram integration
- `livekit-plugins-groq`: Groq LLM integration
- `livekit-plugins-silero`: Voice activity detection
- `livekit-plugins-turn-detector`: Multilingual turn detection
- `livekit-plugins-noise-cancellation`: Audio noise reduction
- `pydantic-settings`: Configuration management

## Development

### Project Structure
```
worker/
├── agent_worker.py    # Main worker implementation
├── config.py          # Configuration management
├── env_sample         # Environment variables template
├── pyproject.toml     # Poetry configuration
└── README.md          # This file
```

### Adding New Features
To add new plugins or modify behavior:
1. Update dependencies in `pyproject.toml`
2. Import new plugins in `agent_worker.py`
3. Modify the session configuration as needed

## Troubleshooting

### Common Issues

1. **Connection Failures**: Verify all API keys are correct and services are accessible
2. **Audio Quality**: Check noise cancellation settings and microphone configuration
3. **Performance**: Monitor resource usage and adjust model parameters if needed

### Debug Mode
Enable debug logging by setting environment variables:
```bash
export LIVEKIT_LOG_LEVEL=debug
poetry run python agent_worker.py
```

## License

This project is part of the Hestia Voice AI workshop series.

## Support

For issues and questions:
- Check the [LiveKit documentation](https://docs.livekit.io)
- Review the [Deepgram API docs](https://developers.deepgram.com)
- Consult the [Groq API documentation](https://groq.com/docs)