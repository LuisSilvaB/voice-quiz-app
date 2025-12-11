# app/api/ai_api_client.py

# OpenRouter AI integration - Using FREE models with reasoning and structured outputs
import openai
import json
from typing import List, Optional, Type, TypeVar
from dotenv import load_dotenv
from pydantic import BaseModel
import os

# Load environment variables from .env file
load_dotenv()
openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "")

T = TypeVar("T", bound=BaseModel)


# OpenRouter client configuration
def get_openrouter_client():
    """Create and return an OpenRouter client instance"""
    return openai.OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=openrouter_api_key,
    )


def query_openrouter(
    messages: List[dict],
    model: str = "arcee-ai/trinity-mini:free",
    max_tokens: int = 4096,
    enable_reasoning: bool = True,
    response_format: Optional[dict] = None,
):
    """
    Query OpenRouter with specified model and optional structured output

    Available FREE models:
    - arcee-ai/trinity-mini:free (Reasoning model, best for complex tasks)
    - deepseek/deepseek-chat-v3-0324:free (Fast, great for general tasks)
    - meta-llama/llama-3.3-70b-instruct:free (Powerful, good reasoning)
    - google/gemini-2.5-pro-exp-03-25:free (Google's latest)
    - mistralai/mistral-small-3.1-24b-instruct:free (Balanced performance)
    """
    client = get_openrouter_client()

    # Prepare extra_body with reasoning if enabled
    extra_body = {}
    if enable_reasoning:
        extra_body["reasoning"] = {"enabled": True}

    # Prepare request parameters
    request_params = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
    }

    # Add response_format if provided (for JSON mode)
    if response_format:
        request_params["response_format"] = response_format

    # Add extra_body if not empty
    if extra_body:
        request_params["extra_body"] = extra_body

    response = client.chat.completions.create(**request_params)
    return response.choices[0].message.content


def query_structured(
    messages: List[dict],
    response_model: Type[T],
    model: str = "arcee-ai/trinity-mini:free",
    max_tokens: int = 4096,
    enable_reasoning: bool = True,
) -> T:
    """
    Query OpenRouter with structured output using Pydantic model

    Args:
        messages: List of message dictionaries
        response_model: Pydantic model class for response validation
        model: Model to use
        max_tokens: Maximum tokens in response
        enable_reasoning: Whether to enable reasoning mode

    Returns:
        Validated Pydantic model instance
    """
    # Add simplified JSON instruction to system message
    schema_instruction = f"""

IMPORTANT: You MUST respond with ONLY valid JSON data (no explanations, no schema definitions).
The JSON must match this structure:
- For QuizResponse: {{"title": "string", "questions": [...]}}
- For TitleResponse: {{"title": "string"}}
- For Question: {{"questionTitle": "string", "alternatives": ["a", "b"] or null, "answer": "string", "correctIndex": 0 or null}}

Do NOT include the schema definition itself. Only provide the actual data."""

    # Modify the last system message or add new one
    modified_messages = messages.copy()
    if modified_messages and modified_messages[0]["role"] == "system":
        modified_messages[0]["content"] += schema_instruction
    else:
        modified_messages.insert(
            0,
            {
                "role": "system",
                "content": f"You are a helpful assistant that responds in JSON.{schema_instruction}",
            },
        )

    # Request JSON mode
    response_format = {"type": "json_object"}

    # Get response
    content = query_openrouter(
        messages=modified_messages,
        model=model,
        max_tokens=max_tokens,
        enable_reasoning=enable_reasoning,
        response_format=response_format,
    )

    # Parse and validate JSON
    try:
        data = json.loads(content)

        # Check if the model returned the schema instead of data
        if "$defs" in data or "properties" in data:
            raise ValueError("Model returned schema definition instead of data. Please try again.")

        return response_model.model_validate(data)
    except (json.JSONDecodeError, ValueError) as e:
        raise ValueError(f"Failed to parse AI response as JSON: {e}\nResponse: {content}")


# Main query function - uses Trinity Mini with reasoning (best for quiz generation)
def query_ai(messages: List[dict]):
    """Main AI query function using Arcee AI Trinity Mini with reasoning (free)"""
    return query_openrouter(
        messages=messages,
        model="arcee-ai/trinity-mini:free",
        max_tokens=4096,
        enable_reasoning=True,  # Enable reasoning for better quality
    )


# Title generation - uses Trinity Mini (same as main queries)
def query_title(messages: List[dict]):
    """Generate titles using Trinity Mini (free, fast, and reliable)"""
    return query_openrouter(
        messages=messages,
        model="arcee-ai/trinity-mini:free",
        max_tokens=100,
        enable_reasoning=False,  # No reasoning needed for titles
    )


# Advanced query - uses Trinity Mini with enhanced reasoning
def query_advanced(messages: List[dict]):
    """Advanced queries using Trinity Mini with reasoning (free, best quality)"""
    return query_openrouter(
        messages=messages,
        model="arcee-ai/trinity-mini:free",
        max_tokens=4096,
        enable_reasoning=True,
    )


# Legacy compatibility functions (redirect to OpenRouter)
def query_usellm(messages: List[dict]):
    """Legacy compatibility - redirects to OpenRouter"""
    return query_ai(messages)


def query_fireworks(messages: List[dict]):
    """Legacy compatibility - redirects to OpenRouter"""
    return query_ai(messages)


def query_together(messages: List[dict]):
    """Legacy compatibility - redirects to OpenRouter"""
    return query_ai(messages)


def query_title_together(messages: List[dict]):
    """Legacy compatibility - redirects to OpenRouter title generation"""
    return query_title(messages)
