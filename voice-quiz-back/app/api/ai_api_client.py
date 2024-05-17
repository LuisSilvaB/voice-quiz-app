#app/api/ai_api_client.py

#interacting with the AI services
from usellm import Message, Options, UseLLM
import openai

from typing import List

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
fireworks_api_key = os.getenv("FIREWORKS_API_KEY")
together_api_key = os.getenv("TOGETHER_API_KEY")

def query_usellm(messages:List[Message]):
    service_usellm = UseLLM(service_url="https://usellm.org/api/llm")
    options = Options(messages=messages)
     # Interact with the service usellm
    response = service_usellm.chat(options)
    return response.content

def query_fireworks(messages:List[dict]):
    service_fireworks = openai.OpenAI(
        base_url = "https://api.fireworks.ai/inference/v1",
        api_key=fireworks_api_key,
    )
    client_fireworks = service_fireworks.chat.completions.create(
        model="accounts/fireworks/models/mixtral-8x7b-instruct",
        messages=messages,
        max_tokens=4096,
    )
    return client_fireworks.choices[0].message.content

def query_together(messages:List[dict]):
    service_together = openai.OpenAI(
        base_url='https://api.together.xyz/v1',
        api_key=together_api_key,
    )
    client_together = service_together.chat.completions.create(
        model="Qwen/Qwen1.5-32B-Chat",
        max_tokens=4096,
        messages=messages,
    )
    return client_together.choices[0].message.content

def query_title_together(messages:List[dict]):
    service_together = openai.OpenAI(
        base_url='https://api.together.xyz/v1',
        api_key=together_api_key,
    )
    client_together = service_together.chat.completions.create(
        model="Qwen/Qwen1.5-14B-Chat",
        max_tokens=2048,
        messages=messages,
    )
    return client_together.choices[0].message.content
