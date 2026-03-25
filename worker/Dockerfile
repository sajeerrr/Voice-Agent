FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=2.2.1
ENV POETRY_VIRTUALENVS_CREATE=false

RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"

COPY pyproject.toml poetry.lock README.md ./
RUN poetry install --no-interaction --no-ansi --no-root

COPY . .

CMD ["poetry", "run", "python", "agent_worker.py", "dev"]
