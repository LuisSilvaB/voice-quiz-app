# app/services/usellm_service.py
from flask import jsonify, request

from app.api.ai_api_client import query_ai, query_title
from app.utils.helpers import read_documents, select_template_system, validate_documents


def process_docs():
    question_type = request.form.get("kindquestion")
    if not question_type:
        return "Question type is missing or empty", 400

    if not validate_documents(request.files):
        return "No documents found", 400

    transcript_text = "".join(read_documents(request.files))
    template_system = select_template_system(question_type)
    template_user = transcript_text

    messages = [
        {"role": "system", "content": template_system},
        {"role": "user", "content": template_user},
    ]

    response_content = query_ai(messages)  # OpenRouter AI call

    # Logging response for debugging
    print("Response from OpenRouter (Trinity Mini): ", response_content)

    # Prepare and return response
    return jsonify({"data": response_content, "status": "success"})


def process_title_docs():
    if not validate_documents(request.files):
        return "No documents found", 400

    transcript_text = "".join(read_documents(request.files))

    template_system = "Eres un asistente que analiza fragmentos de sesiones de clase y proporciona un título adecuado para cada uno de ellos."
    template_user = f"Dame el enunciado de un titulo de no mas de 20 palabras sobre el siguiente texto: {transcript_text}"

    messages = [
        {"role": "system", "content": template_system},
        {"role": "user", "content": template_user},
    ]

    response_content = query_title(messages)  # OpenRouter title generation

    # Logging response for debugging
    print("Response from OpenRouter (Mistral Small): ", response_content)

    # Prepare and return response
    return jsonify({"title": response_content, "status": "success"})
