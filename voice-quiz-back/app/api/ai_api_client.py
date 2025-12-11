# app/api/ai_api_client.py

# OpenRouter AI integration - Using FREE models with reasoning
import openai
from typing import List
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "")


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
):
    """
    Query OpenRouter with specified model

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

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        extra_body=extra_body if extra_body else None,
    )
    return response.choices[0].message.content


# Main query function - uses Trinity Mini with reasoning (best for quiz generation)
def query_ai(messages: List[dict]):
    """Main AI query function using Arcee AI Trinity Mini with reasoning (free)"""
    return query_openrouter(
        messages=messages,
        model="arcee-ai/trinity-mini:free",
        max_tokens=4096,
        enable_reasoning=True,  # Enable reasoning for better quality
    )


# Title generation - uses smaller, faster model without reasoning
def query_title(messages: List[dict]):
    """Generate titles using Mistral Small (free, optimized for short responses)"""
    return query_openrouter(
        messages=messages,
        model="mistralai/mistral-small-3.1-24b-instruct:free",
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
