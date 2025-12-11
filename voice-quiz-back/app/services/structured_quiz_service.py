# app/services/structured_quiz_service.py
"""
Service for generating quizzes using improved JSON prompting
Returns reliable JSON responses without complex schema validation
"""

from flask import jsonify, request
from app.api.ai_api_client import query_ai, query_title
from app.utils.helpers import read_documents, validate_documents
import json


def process_docs_structured():
    """
    Generate quiz questions using improved JSON prompting
    Returns clean JSON matching expected format
    """
    question_type = request.form.get("kindquestion")
    if not question_type:
        return jsonify({"error": "Question type is missing"}), 400

    if not validate_documents(request.files):
        return jsonify({"error": "No documents found"}), 400

    transcript_text = "".join(read_documents(request.files))

    # Build the prompt based on question type
    if question_type == "multiple_answer":
        format_example = """{
  "title": "Topic Title",
  "questions": [
    {
      "questionTitle": "Question text here?",
      "alternatives": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct answer with explanation from class content",
      "correctIndex": 0
    }
  ]
}"""

    elif question_type == "open_answer":
        format_example = """{
  "title": "Topic Title",
  "questions": [
    {
      "questionTitle": "Question text here?",
      "alternatives": null,
      "answer": "Expected answer with explanation from class content",
      "correctIndex": null
    }
  ]
}"""

    elif question_type == "true_or_false":
        format_example = """{
  "title": "Topic Title",
  "questions": [
    {
      "questionTitle": "Statement to evaluate",
      "alternatives": ["Verdadero", "Falso"],
      "answer": "Correct answer with explanation from class content",
      "correctIndex": 0
    }
  ]
}"""

    else:
        return jsonify({"error": f"Invalid question type: {question_type}"}), 400

    messages = [
        {
            "role": "system",
            "content": f"""You are an expert quiz generator. Generate 3-5 high-quality questions based on the transcript.

CRITICAL: Respond with ONLY valid JSON. No explanations, no markdown, no code blocks. Just pure JSON.

Required format:
{format_example}

Rules:
- Generate 3-5 questions
- Use content from the transcript
- Provide detailed explanations in the answer field
- For multiple choice: 4 alternatives, correctIndex 0-3
- For true/false: 2 alternatives ["Verdadero", "Falso"], correctIndex 0 or 1
- For open questions: alternatives and correctIndex must be null""",
        },
        {
            "role": "user",
            "content": f"Create a quiz from this class transcript:\n\n{transcript_text}",
        },
    ]

    try:
        # Use regular query_ai (no complex structured validation)
        response_text = query_ai(messages)

        # Try to extract JSON if wrapped in markdown
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        # Parse JSON
        quiz_data = json.loads(response_text)

        print(f"✅ Generated quiz with {len(quiz_data.get('questions', []))} questions")

        return jsonify({"data": quiz_data, "status": "success", "structured": True})

    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {e}")
        print(f"Response was: {response_text[:500]}")
        return jsonify({"error": "Failed to parse quiz response", "details": str(e)}), 500
    except Exception as e:
        print(f"❌ Error generating quiz: {e}")
        return jsonify({"error": "Failed to generate quiz", "details": str(e)}), 500


def process_title_structured():
    """
    Generate title using improved JSON prompting
    """
    if not validate_documents(request.files):
        return jsonify({"error": "No documents found"}), 400

    transcript_text = "".join(read_documents(request.files))

    messages = [
        {
            "role": "system",
            "content": """You are an expert at creating concise titles.

CRITICAL: Respond with ONLY valid JSON. No explanations, no markdown.

Required format:
{"title": "Concise title here (max 20 words)"}""",
        },
        {"role": "user", "content": f"Create a title for this transcript:\n\n{transcript_text}"},
    ]

    try:
        response_text = query_title(messages)

        # Try to extract JSON if wrapped
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        title_data = json.loads(response_text)

        print(f"✅ Generated title: {title_data.get('title', '')}")

        return jsonify(
            {"title": title_data.get("title", ""), "status": "success", "structured": True}
        )

    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {e}")
        return jsonify({"error": "Failed to parse title response", "details": str(e)}), 500
    except Exception as e:
        print(f"❌ Error generating title: {e}")
        return jsonify({"error": "Failed to generate title", "details": str(e)}), 500
