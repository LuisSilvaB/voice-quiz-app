# app/api/ai_api_client.py

# OpenRouter AI integration - Using FREE models
import os

import openai
from dotenv import load_dotenv

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
    messages: list[dict],
    model: str = "deepseek/deepseek-chat-v3-0324:free",
    max_tokens: int = 4096,
):
    """
    Query OpenRouter with specified model

    Available FREE models:
    - deepseek/deepseek-chat-v3-0324:free (Fast, great for general tasks)
    - meta-llama/llama-3.3-70b-instruct:free (Powerful, good reasoning)
    - google/gemini-2.5-pro-exp-03-25:free (Google's latest)
    - mistralai/mistral-small-3.1-24b-instruct:free (Balanced performance)
    """
    client = get_openrouter_client()
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content


# Main query function - uses DeepSeek V3 (fast and capable)
def query_ai(messages: list[dict]):
    """Main AI query function using DeepSeek V3 Chat (free)"""
    return query_openrouter(
        messages=messages, model="deepseek/deepseek-chat-v3-0324:free", max_tokens=4096
    )


# Title generation - uses smaller, faster model
def query_title(messages: list[dict]):
    """Generate titles using Mistral Small (free, optimized for short responses)"""
    return query_openrouter(
        messages=messages,
        model="mistralai/mistral-small-3.1-24b-instruct:free",
        max_tokens=100,
    )


# Advanced query - uses Llama 3.3 70B for complex reasoning
def query_advanced(messages: list[dict]):
    """Advanced queries using Llama 3.3 70B (free, powerful reasoning)"""
    return query_openrouter(
        messages=messages,
        model="meta-llama/llama-3.3-70b-instruct:free",
        max_tokens=4096,
    )


# Legacy compatibility functions (redirect to OpenRouter)
def query_usellm(messages: list[dict]):
    """Legacy compatibility - redirects to OpenRouter"""
    return query_ai(messages)


def query_fireworks(messages: list[dict]):
    """Legacy compatibility - redirects to OpenRouter"""
    return query_ai(messages)


def query_together(messages: list[dict]):
    """Legacy compatibility - redirects to OpenRouter"""
    return query_ai(messages)


def query_title_together(messages: list[dict]):
    """Legacy compatibility - redirects to OpenRouter title generation"""
    return query_title(messages)
