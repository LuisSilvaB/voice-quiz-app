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
OPENAI_API_KEY=your_key_here
```
