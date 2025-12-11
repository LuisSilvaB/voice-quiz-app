# app/services/fireworks_service.py
from flask import jsonify, request

from app.api.ai_api_client import query_ai
from app.utils.helpers import read_documents, select_template_system, validate_documents


def process_docs():
    question_type = request.form.get("kindquestion")
    if not question_type:
        return "Question type is missing or empty", 400

    if not validate_documents(request.files):
        return "No documents found", 400

    transcript_text = "".join(read_documents(request.files))
    template_system = select_template_system(question_type)
    # Prepare the conversation for the user role
    template_user = transcript_text

    # Prepare the messages
    messages = [
        {
            "role": "system",
            "content": template_system,
        },
        {
            "role": "user",
            "content": template_user,
        },
    ]

    response_content = query_ai(messages)  # OpenRouter AI call

    print("Response from OpenRouter (Trinity Mini): ", response_content)

    # Prepare and return response
    return jsonify({"data": response_content, "status": "success"})
