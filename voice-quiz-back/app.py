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
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

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
<s>[INST]Eres un asistente que crea preguntas basadas únicamente en transcripciones de grabaciones de sesiones de clase.
Tu objetivo es reforzar el aprendizaje de los estudiantes para que comprendan toda la información importante que el docente enseñó durante la clase.
Para cumplir con este objetivo, debes generar un cuestionario de 6 PREGUNTAS DE OPCION MULTIPLE basadas en la información proporcionada en la transcripción de la clase.
Cada pregunta debe presentarse obligatoriamente en formato JSON con solo 2 atributos: "question" y "answer", siguiendo la estructura siguiente:
[/INST]
[
    {
        "question": "<Aqui va la pregunta y opciones: a)... b)... c)... d)... >",
        "answer": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
    },
    {
        "question": "<Aqui va la pregunta y opciones: a)...  b)... c)... d)... >" ,
        "answer": "<Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
    },
    {
        "question": "<Aqui va la pregunta y opciones: a)...  b)... c)... d)... >" ,
        "answer": "<Aquí va la respuesta correcta junto con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante>"
    }
]
</s>
[INST] Aquí va la transcripción de la clase que utilizarás para crear las preguntas. [/INST]
"""

template_system_open_questions = """
Eres un experto en crear preguntas basadas únicamente en transcripciones de grabaciones de sesiones de clase.
Tu objetivo es reforzar el aprendizaje de los estudiantes para que comprendan toda la información importante que el docente enseñó durante la clase.
Haces esto creando cuestionarios con preguntas sobre el texto transcrito que el profesor dijo durante la clase y que te proporcionará en los siguientes mensajes.
El docente desea que realices 6 preguntas del tipo abiertas para retroalimentar lo que se dijo en clase.
Las preguntas deben tener la siguiente estructura y las presentarás en el siguiente formato según el tipo de pregunta:

[
    {
        "question": "(Aquí va la pregunta)",
        "answer": "(Aquí va la respuesta correcta junto con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante)"
    },
    {
        "question": "(Aquí va la pregunta)",
        "answer": "(Aquí va la respuesta correcta junto con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante)"
    },
    {
        "question": "(Aquí va la pregunta)",
        "answer": "(Aquí va la respuesta correcta junto con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante)"
    }
]
"""

template_system_true_or_false = """
Eres un experto en crear preguntas basadas únicamente en transcripciones de grabaciones de sesiones de clase.
Tu objetivo es reforzar el aprendizaje de los estudiantes para que comprendan toda la información importante que el docente enseñó durante la clase.
Haces esto creando cuestionarios con preguntas sobre el texto transcrito que el profesor dijo durante la clase y que te proporcionará en los siguientes mensajes.
El docente desea que realices 6 preguntas de verdadero o falso para retroalimentar lo que se dijo en clase.
Las preguntas deben tener la siguiente estructura y las presentarás en el siguiente formato:

[
    {
        "question": "Verdadero o Falso: (Aquí va la afirmación)",
        "answer": "(Verdadero/Falso) (Aquí va la explicación que respalda la respuesta correcta, recordando lo que el docente dijo durante la clase)"
    },
    {
        "question": "Verdadero o Falso: (Aquí va la afirmación)",
        "answer": "(Verdadero/Falso) (Aquí va la explicación que respalda la respuesta correcta, recordando lo que el docente dijo durante la clase)"
    },
    {
        "question": "Verdadero o Falso: (Aquí va la afirmación)",
        "answer": "(Verdadero/Falso) (Aquí va la explicación que respalda la respuesta correcta, recordando lo que el docente dijo durante la clase)"
    }
]

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
        
    # Split the documents into smaller parts
    chunk = CharacterTextSplitter(separator=".", chunk_size=6800, chunk_overlap=0)
    trans_docs = chunk.create_documents([transcript_text])

    # Prepare the conversation for the system role
    if question_type == "multiple_answer":
        template_system = template_system_multiple_answer_questions
    elif question_type == "open":
        template_system = template_system_open_questions
    else:
        template_system = template_system_true_or_false

    # Prepare messages and questions based on transcript length
    if trans_docs.__len__() == 2:
        first_fragment = trans_docs[0].page_content
        second_fragment = trans_docs[1].page_content

        # Prepare the conversation for the user role
        template_user = f"{first_fragment}"

        # Prepare the messages
        messages = [
            Message(role="system", content=template_system),
            Message(role="user", content=template_user)
        ]

        # Prepare the options
        options = Options(messages=messages)
        # Interact with the service
        first_response = service_usellm.chat(options)

        # Append the assistant's response to the messages
        messages.append(Message(role="assistant", content=first_response.content))

        second_template_user = f"Genera 6 preguntas mas con respecto a esta transcripcion que es la continuacion de la anterior en json: {second_fragment}"

        messages.append(Message(role="user", content=second_template_user))

        # Prepare the options
        options = Options(messages=messages)
        
        # Interact with the service
        second_response = service_usellm.chat(options)

        messages.append(Message(role="assistant", content=second_response.content))

        first_response_json=first_response.content
        second_response_json=second_response.content
    else:
        first_fragment = trans_docs[0].page_content
        # Prepare the conversation for the user role
        template_user = f"{first_fragment}"

        # Prepare the messages
        messages = [
            Message(role="system", content=template_system),
            Message(role="user", content=template_user)
        ]

        # Prepare the options
        options = Options(messages=messages)
        # Interact with the service
        first_response = service_usellm.chat(options)

        first_response_json=first_response.content
        second_response_json=None

    # Additional user interaction to generate a title for the summary
    third_template_user = f"Dentro de toda la transcripción anterior, se discutieron varios aspectos sobre un tema en particular. Por favor, genera un título que refleje los puntos clave tratados en la transcripción para proporcionar un resumen conciso y relevante de la clase."

    messages.append(Message(role="user", content=third_template_user))

    # Prepare the options
    options = Options(messages=messages)

    # Interact with the service
    third_response = service_usellm.chat(options)

    Title = f"{third_response.content}"

    
    # Prepare response data
    data = {
        'questions1': first_response_json,
        'questions2': second_response_json,
        'title': Title,
        'status': 'success'
    }

    print(data)

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
        
    # Split the documents into smaller parts
    chunk = CharacterTextSplitter(separator=".", chunk_size=6800, chunk_overlap=0)
    trans_docs = chunk.create_documents([transcript_text])

    # Prepare the conversation for the system role
    if question_type == "multiple_answer":
        template_system = template_system_multiple_answer_questions
    elif question_type == "open":
        template_system = template_system_open_questions
    else:
        template_system = template_system_true_or_false

    # Prepare messages and questions based on transcript length
    if trans_docs.__len__() == 2:
        first_fragment = trans_docs[0].page_content
        second_fragment = trans_docs[1].page_content

        # Prepare the conversation for the user role
        template_user = f"{first_fragment}"

        # Prepare the messages
        messages = [
            Message(role="system", content=template_system),
            Message(role="user", content=template_user)
        ]

        # Prepare the options
        client_fireworks = service_fireworks.chat.completions.create(
            model="accounts/fireworks/models/mistral-7b-instruct-v0p2",
            frequency_penalty=0,
            presence_penalty=0,
            max_tokens=50,
            temperature=0.6,
            top_p=1,
            messages=messages,
        )
        # Interact with the service
        first_response = client_fireworks.choices[0].message

        # Append the assistant's response to the messages
        messages.append(Message(role="assistant", content=first_response.content))

        second_template_user = f"Genera 6 preguntas más siguiendo el formato json con respecto a esta transcripcion que es la continuacion de la anterior : {second_fragment}"

        messages.append(Message(role="user", content=second_template_user))

        # Prepare the options
        client_fireworks = service_fireworks.chat.completions.create(
            model="accounts/fireworks/models/mistral-7b-instruct-v0p2",
            frequency_penalty=0,
            presence_penalty=0,
            max_tokens=50,
            temperature=0.6,
            top_p=1,
            messages=messages,
        )
        
        # Interact with the service
        second_response = client_fireworks.choices[0].message

        messages.append(Message(role="assistant", content=second_response.content))

        first_response_json=first_response.content
        second_response_json=second_response.content
    else:
        first_fragment = trans_docs[0].page_content
        # Prepare the conversation for the user role
        template_user = f"{first_fragment}"

        # Prepare the messages
        messages = [
            Message(role="system", content=template_system),
            Message(role="user", content=template_user)
        ]

        # Prepare the options
        client_fireworks = service_fireworks.chat.completions.create(
            model="accounts/fireworks/models/mistral-7b-instruct-v0p2",
            frequency_penalty=0,
            presence_penalty=0,
            max_tokens=50,
            temperature=0.6,
            top_p=1,
            messages=messages,
        )
        # Interact with the service
        first_response = client_fireworks.choices[0].message

        first_response_json=first_response.content
        second_response_json=None

    # Additional user interaction to generate a title for the summary
    third_template_user = f"Dentro de toda la transcripción anterior, se discutieron varios aspectos sobre un tema en particular. Por favor, genera un título que refleje los puntos clave tratados en la transcripción para proporcionar un resumen conciso y relevante de la clase."

    messages.append(Message(role="user", content=third_template_user))

    # Prepare the options
    client_fireworks = service_fireworks.chat.completions.create(
            model="accounts/fireworks/models/mistral-7b-instruct-v0p2",
            frequency_penalty=0,
            presence_penalty=0,
            max_tokens=50,
            temperature=0.6,
            top_p=1,
            messages=messages,
    )

    # Interact with the service
    third_response = client_fireworks.choices[0].message

    Title = f"{third_response.content}"
    
    # Prepare response data
    data = {
        'questions1': first_response_json,
        'questions2': second_response_json,
        'title': Title,
        'status': 'success'
    }

    print(data)

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
        
    # Split the documents into smaller parts
    chunk = CharacterTextSplitter(separator=".", chunk_size=6800, chunk_overlap=0)
    trans_docs = chunk.create_documents([transcript_text])

    # Prepare the conversation for the system role
    if question_type == "multiple_answer":
        template_system = template_system_multiple_answer_questions
    elif question_type == "open":
        template_system = template_system_open_questions
    else:
        template_system = template_system_true_or_false

    # Prepare messages and questions based on transcript length
    if trans_docs.__len__() == 2:
        first_fragment = trans_docs[0].page_content
        second_fragment = trans_docs[1].page_content

        # Prepare the conversation for the user role
        template_user = f"{first_fragment}"

        # Prepare the messages
        messages = [
            Message(role="system", content=template_system),
            Message(role="user", content=template_user)
        ]

        # Prepare the options
        client_together = service_together.chat.completions.create(
            model="Qwen/Qwen1.5-14B-Chat",
            max_tokens=50,
            temperature=0.7,
            top_p=0.7,
            stop=["<|im_end|>","<|im_start|>"],
            messages=messages,
        )
        # Interact with the service
        first_response = client_together.choices[0].message

        # Append the assistant's response to the messages
        messages.append(Message(role="assistant", content=first_response.content))

        second_template_user = f"Genera 6 preguntas más siguiendo el formato json con respecto a esta transcripcion que es la continuacion de la anterior : {second_fragment}"

        messages.append(Message(role="user", content=second_template_user))

        # Prepare the options
        client_together = service_together.chat.completions.create(
            model="Qwen/Qwen1.5-14B-Chat",
            max_tokens=50,
            temperature=0.7,
            top_p=0.7,
            stop=["<|im_end|>","<|im_start|>"],
            messages=messages,
        )
        
        # Interact with the service
        second_response = client_together.choices[0].message

        messages.append(Message(role="assistant", content=second_response.content))

        first_response_json=first_response.content
        second_response_json=second_response.content
    else:
        first_fragment = trans_docs[0].page_content
        # Prepare the conversation for the user role
        template_user = f"{first_fragment}"

        # Prepare the messages
        messages = [
            Message(role="system", content=template_system),
            Message(role="user", content=template_user)
        ]

        # Prepare the options
        client_together = service_together.chat.completions.create(
            model="Qwen/Qwen1.5-14B-Chat",
            max_tokens=50,
            temperature=0.7,
            top_p=0.7,
            stop=["<|im_end|>","<|im_start|>"],
            messages=messages,
        )
        # Interact with the service
        first_response = client_together.choices[0].message

        first_response_json=first_response.content
        second_response_json=None

    # Additional user interaction to generate a title for the summary
    third_template_user = f"Dentro de toda la transcripción anterior, se discutieron varios aspectos sobre un tema en particular. Por favor, genera un título que refleje los puntos clave tratados en la transcripción para proporcionar un resumen conciso y relevante de la clase."

    messages.append(Message(role="user", content=third_template_user))

    # Prepare the options
    client_together = service_together.chat.completions.create(
            model="Qwen/Qwen1.5-14B-Chat",
            max_tokens=50,
            temperature=0.7,
            top_p=0.7,
            stop=["<|im_end|>","<|im_start|>"],
            messages=messages,
        )

    # Interact with the service
    third_response = client_together.choices[0].message

    Title = f"{third_response.content}"

    # Prepare response data
    data = {
        'questions1': first_response_json,
        'questions2': second_response_json,
        'title': Title,
        'status': 'success'
    }

    print(data)

    # Return response as JSON
    return jsonify(data)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)