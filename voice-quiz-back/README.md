# Voice Quiz Backend

Flask API backend for the Voice Quiz application.

## Development Setup

This project uses [uv](https://github.com/astral-sh/uv) for fast Python package management.

### Prerequisites

Install uv:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Installation

1. Create a virtual environment and install dependencies:
```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

Or use the sync command for faster installation:
```bash
uv sync
```

### Running the Application

Development mode with uv:
```bash
uv run dev
```

Or directly with Python:
```bash
source .venv/bin/activate
python run.py
```

The API will be available at `http://localhost:8000`

### Code Quality

This project uses [Ruff](https://docs.astral.sh/ruff/) for linting and formatting.

Check for linting issues:
```bash
ruff check .
```

Auto-fix linting issues:
```bash
ruff check --fix .
```

Format code:
```bash
ruff format .
```

Run both linting and formatting:
```bash
ruff check --fix . && ruff format .
```


### Adding Dependencies

Add a new dependency:
```bash
uv add package-name
```

Add a development dependency:
```bash
uv add --dev package-name
```

### Environment Variables

Create a `.env` file in this directory with your configuration:
```
OPENROUTER_API_KEY=your_openrouter_key_here
```

#### Getting an OpenRouter API Key (FREE)

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Go to [Keys](https://openrouter.ai/keys) to generate your API key
4. Copy the key to your `.env` file

**Free tier includes:**
- Access to multiple free models (DeepSeek, Llama, Gemini, Mistral, etc.)
- 20 requests per minute
- 1,000 requests per day (with 10+ credits)

#### Available Free Models

This project uses the following free models from OpenRouter:
- **DeepSeek V3 Chat** - Main model for general queries (fast & capable)
- **Mistral Small 3.1** - Title generation (optimized for short responses)
- **Llama 3.3 70B** - Advanced reasoning tasks (powerful)
- **Gemini 2.5 Pro** - Google's latest (experimental)

