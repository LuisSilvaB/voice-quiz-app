# app/services/together_service.py
from flask import jsonify, request
from app.utils.helpers import validate_documents, read_documents, select_template_system
from app.api.ai_api_client import query_together

def process_docs():
    question_type = request.form.get('kindquestion')
    if not question_type:
        return 'Question type is missing or empty', 400
    
    if not validate_documents(request.files):
        return 'No documents found', 400
    
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
        }
    ]

    response_content = query_together(messages)  # AI Model call

    print("respuesta del modelo 3: ")
    print(response_content)

    # Prepare and return response
    return jsonify({
        'data': response_content,
        'status': 'success'
    })
