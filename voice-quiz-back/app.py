from flask import Flask, jsonify, request
from flask_cors import CORS

from langchain.text_splitter import CharacterTextSplitter

from usellm import Message, Options, UseLLM
import openai

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
fireworks_api_key = os.getenv("FIREWORKS_API_KEY")
together_api_key = os.getenv("TOGETHER_API_KEY")

# Initialize the Flask application
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Initialize the service usellm
service_usellm = UseLLM(service_url="https://usellm.org/api/llm")

# Initialize the service fireworksAI
service_fireworks = openai.OpenAI(
    base_url = "https://api.fireworks.ai/inference/v1",
    api_key=fireworks_api_key,
)

# Initialize the service togetherAI
service_together = openai.OpenAI(
    base_url='https://api.together.xyz/v1',
    api_key=together_api_key,    
)

# System role templates for different question types
template_system_multiple_answer_questions = """
Eres una api que analiza transcripciones de audio de sesiones de clase y crea cuestionarios de preguntas de respuesta multiples con el fin de retroalimentar a los estudiantes siguiendo este formato JSON como respuesta.

ESTRUCTURA DE RESPUESTA, CON ESPACIADO Y SALTOS DE LINEA PARA FACILITAR LA LECTURA:

[
    {
        "titulo": "<Titulo general para toda la trancripcion>",
        "preguntas":    [   
                            {
                                "pregunta": "<Aqui va una pregunta>",
                                "alternativas": ["a)...", "b)...", "c)...", "d)..."],
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                            {
                                "pregunta": "<Aqui va una pregunta>",
                                "alternativas": ["a)...", "b)...", "c)...", "d)..."],
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                            {
                                "pregunta": "<Aqui va una pregunta>",
                                "alternativas": ["a)...", "b)...", "c)...", "d)..."],
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                        ]
    }
]

Los clientes te enviarán una transcripcion de una clase y tu debes responder únicamente en esta plantilla JSON con el titulo del cuestionario y varias preguntas con sus respectivas respuestas.
"""

template_system_open_questions = """
Eres una api que analiza transcripciones de audio de sesiones de clase y crea cuestionarios de preguntas del tipo abiertas con el fin de retroalimentar a los estudiantes siguiendo este formato JSON como respuesta.

ESTRUCTURA DE RESPUESTA, CON ESPACIADO, MARGEN Y SALTOS DE LINEA IGUAL AL FORMATO JSON:

[
    {
        "titulo": "<Titulo general para toda la trancripcion>",
        "preguntas":    [   
                            {
                                "pregunta": "<Aqui va una pregunta abierta>",
                                "alternativas": null,
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                            {
                                "pregunta": "<Aqui va una pregunta abierta>",
                                "alternativas": null,
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                            {
                                "pregunta": "<Aqui va una pregunta abierta>",
                                "alternativas": null,
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                        ]
    }
]

Los clientes te enviarán una transcripcion de una clase y tu debes responder únicamente en esta plantilla JSON con el titulo del cuestionario y varias preguntas con sus respectivas respuestas.
"""

template_system_true_or_false = """
Eres una api que analiza transcripciones de audio de sesiones de clase y crea cuestionarios de preguntas del tipo verdadero o falso con el fin de retroalimentar a los estudiantes siguiendo este formato JSON como respuesta.

FORMATO JSON:

[
    {
        "titulo": "<Titulo general para toda la trancripcion>",
        "preguntas":    [   
                            {
                                "pregunta": "<Aqui va la afirmación>",
                                "alternativas": ["Verdadero", "Falso"],
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                            {
                                "pregunta": "<Aqui va la afirmación>",
                                "alternativas": ["Verdadero", "Falso"],
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                            {
                                "pregunta": "<Aqui va la afirmación>",
                                "alternativas": ["Verdadero", "Falso"],
                                "respuesta": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
                            },
                        ]
    }
]

Los clientes te enviarán una transcripcion de una clase y tu debes responder únicamente en esta plantilla JSON con el titulo del cuestionario y varias preguntas con sus respectivas respuestas.
"""

# Example API endpoint
@app.route('/api/example', methods=['GET'])
def get_example():
    data = {
        'message': 'This is an example API endpoint',
        'status': 'success'
    }
    return jsonify(data)


# API endpoint to process session transcripts and generate questions with usellm
@app.route('/api/docs/v1', methods=['POST'])
def process_docs():    
    question_type = request.form.get('question_type')

    if not question_type:
        return 'Question type is missing or empty', 400
    
    # Validate if documents are present
    if 'documents' not in request.files:
       return 'No documents found', 400
    
    documents = request.files.getlist('documents') # Receive data from .txt files
    
    # Validate if documents are empty
    if len(documents) == 0 or all(file.filename == '' for file in documents):
        return 'No documents found', 400
    
    # Read the documents
    transcript_text = ""
    for file in documents:
        transcript_text += file.read().decode()
        
    # Prepare the conversation for the system role
    if question_type == "multiple_answer":
        template_system = template_system_multiple_answer_questions
    elif question_type == "open":
        template_system = template_system_open_questions
    else:
        template_system = template_system_true_or_false

    # Prepare the conversation for the user role
    template_user = f"{transcript_text}"

    # Prepare the messages
    messages = [
        Message(role="system", content=template_system),
        Message(role="user", content=template_user)
    ]

    # Prepare the options
    options = Options(messages=messages)

    # Interact with the service
    first_response = service_usellm.chat(options)

    # Interact with the service
    first_response_json = first_response.content

    print("respuesta del modelo 1: ")
    print(first_response_json)
    # Prepare response data
    data = {
        'data': first_response_json,
        'status': 'success'
    }
    # Return response as JSON
    return jsonify(data)

# API endpoint to process session transcripts and generate questions with fireworksAI
@app.route('/api/docs/v2', methods=['POST'])
def process_docs_v2():
    
    question_type = request.form.get('question_type')

    if not question_type:
        return 'Question type is missing or empty', 400
    
    # Validate if documents are present
    if 'documents' not in request.files:
       return 'No documents found', 400
    
    documents = request.files.getlist('documents') # Receive data from .txt files
    
    # Validate if documents are empty
    if len(documents) == 0 or all(file.filename == '' for file in documents):
        return 'No documents found', 400
    
    # Read the documents
    transcript_text = ""
    for file in documents:
        transcript_text += file.read().decode()
        
    # Prepare the conversation for the system role
    if question_type == "multiple_answer":
        template_system = template_system_multiple_answer_questions
    elif question_type == "open":
        template_system = template_system_open_questions
    else:
        template_system = template_system_true_or_false

    # Prepare the conversation for the user role
    template_user = f"{transcript_text}"

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
    #model="accounts/fireworks/models/mistral-7b-instruct-v0p2",
    #model="accounts/fireworks/models/mixtral-8x7b-instruct-hf",
    # Prepare the options
    client_fireworks = service_fireworks.chat.completions.create(
        model="accounts/fireworks/models/mistral-7b-instruct-v0p2",
        messages=messages,
        max_tokens=4096,
    )
    # Interact with the service
    first_response_json = client_fireworks.choices[0].message.content

    print("respuesta del modelo 2: ")
    print(first_response_json)
    
    # Prepare response data
    data = {
        'data': first_response_json,
        'status': 'success'
    }

    # Return response as JSON
    return jsonify(data)


# API endpoint to process session transcripts and generate questions with togetherAI
@app.route('/api/docs/v3', methods=['POST'])
def process_docs_v3():
     
    question_type = request.form.get('question_type')

    if not question_type:
        return 'Question type is missing or empty', 400
    
    # Validate if documents are present
    if 'documents' not in request.files:
       return 'No documents found', 400
    
    documents = request.files.getlist('documents') # Receive data from .txt files
    
    # Validate if documents are empty
    if len(documents) == 0 or all(file.filename == '' for file in documents):
        return 'No documents found', 400
    
    # Read the documents
    transcript_text = ""
    for file in documents:
        transcript_text += file.read().decode()
        
    # Prepare the conversation for the system role
    if question_type == "multiple_answer":
        template_system = template_system_multiple_answer_questions
    elif question_type == "open":
        template_system = template_system_open_questions
    else:
        template_system = template_system_true_or_false

    # Prepare the conversation for the user role
    template_user = f"{transcript_text}"

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

    # Prepare the options
    client_together = service_together.chat.completions.create(
        model="Qwen/Qwen1.5-7B-Chat",
        max_tokens=2000,
        messages=messages,
    )
    # Interact with the service
    first_response_json = client_together.choices[0].message.content
    print("respuesta del modelo 3: ")
    print(first_response_json)
    # Prepare response data

    data = {
        'data': first_response_json,
        'status': 'success'
    }
    # Return response as JSON
    return jsonify(data)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)