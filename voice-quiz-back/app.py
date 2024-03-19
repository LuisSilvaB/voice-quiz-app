from flask import Flask, jsonify, request
from flask_cors import CORS

from langchain.text_splitter import CharacterTextSplitter
from usellm import Message, Options, UseLLM

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# Initialize the service
service = UseLLM(service_url="https://usellm.org/api/llm")

# System role templates for different question types
template_system_multiple_answer_questions = """
Eres un experto en crear preguntas basadas únicamente en transcripciones de grabaciones de sesiones de clase.
Tu objetivo es reforzar el aprendizaje de los estudiantes para que comprendan toda la información importante que el docente enseñó durante la clase.
Haces esto creando cuestionarios con preguntas sobre el texto transcrito que el profesor dijo durante la clase y que te proporcionará en los siguientes mensajes.
El docente desea que realices 6 preguntas del tipo respuestas múltiples para retroalimentar lo que se dijo en clase.
Las preguntas deben tener la siguiente estructura y las presentarás en el siguiente formato json con solo 2 atributos por pregunta:

[
    {
        "question": "(Aqui va la pregunta y opciones:    a)...  b)... c)... d)... )",
        "answer": "(Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante)"
    },
    {
        "question": "(Aqui va la pregunta y opciones:    a)...  b)... c)... d)... )" ,
        "answer": "(Aquí va la respuesta correcta con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante)"
    },
    {
        "question": "(Aqui va la pregunta y opciones:    a)...  b)... c)... d)... )" ,
        "answer": "(Aquí va la respuesta correcta junto con una breve explicación que recuerda lo que el docente dijo durante la clase para facilitar la comprensión del estudiante)"
    }
]
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


# API endpoint to process session transcripts and generate questions
@app.route('/api/docs', methods=['POST'])
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
        first_response = service.chat(options)

        # Append the assistant's response to the messages
        messages.append(Message(role="assistant", content=first_response.content))

        second_template_user = f"Genera 6 preguntas mas con respecto a esta transcripcion que es la continuacion de la anterior en json: {second_fragment}"

        messages.append(Message(role="user", content=second_template_user))

        # Prepare the options
        options = Options(messages=messages)
        
        # Interact with the service
        second_response = service.chat(options)

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
        first_response = service.chat(options)

        first_response_json=first_response.content
        second_response_json=None

    # Additional user interaction to generate a title for the summary
    third_template_user = f"Dentro de toda la transcripción anterior, se discutieron varios aspectos sobre un tema en particular. Por favor, genera un título que refleje los puntos clave tratados en la transcripción para proporcionar un resumen conciso y relevante de la clase."

    messages.append(Message(role="user", content=third_template_user))

    # Prepare the options
    options = Options(messages=messages)

    # Interact with the service
    third_response = service.chat(options)

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

"""
Output Example:

{'questions1': '[\n    {\n        "question": "¿Cuál fue uno de los antecedentes de la computadora mencionado en la clase?    a) El ábaco.  b) La máquina de escribir.  c) El teléfono celular.  d) El reloj de arena.",\n        "answer": "a) El ábaco. Explicación: Se menciona que el ábaco fue importante en la materia alrededor de 4000 antes de Cristo, como uno de los antecedentes de la computadora."\n    },\n    {\n        "question": "¿Quién se considera el padre de la computación y por qué?    a) Alan Turing, por su máquina capaz 
de calcular cualquier cosa.  b) Charles Babbage, por su máquina analítica.  c) Blaise Pascal, por la máquina Pascalina.  d) José Mari 
Jakarta, por su invento de tarjetas perforadas.",\n        "answer": "b) Charles Babbage, por su máquina analítica. Explicación: Charles Babbage es considerado el padre de la computación debido a su máquina analítica, que representó un salto hacia el mundo de la informática como se conoce hoy en día."\n    },\n    {\n        "question": "¿Qué importante fundador en el proceso de la computación se menciona en la clase?   a) Alan Turing.  b) Charles Babbage.  c) Douglas Engelbart.  d) José Mari Jakarta.",\n        "answer": "a) Alan Turing. Explicación: Alan Turing es mencionado como un importante fundador en el proceso de la computación, creador de una máquina capaz de calcular cualquier cosa y considerado como el padre de la máquina universal o máquina de Turing."\n    },\n    {\n        "question": "¿Qué aparato fue fundamental para la fabricación de los primeros microchips según la clase?    a) Engranajes.  b) Transistores.  c) Tubos al vacío.  d) Chips de madera.",\n        "answer": "b) Transistores. Explicación: Los transistores fueron fundamentales para la fabricación de los primeros microchips, ya que permitieron el paso de los aparatos eléctricos a los electrónicos."\n    },\n   
 {\n        "question": "¿Cuál fue la primera computadora moderna mencionada en la clase?    a) ENIAC.  b) Mark II.  c) Z3.  d) Prototype de Douglas Engelbart.",\n        "answer": "d) Prototype de Douglas Engelbart. Explicación: La primera computadora moderna mencionada en la clase fue un prototipo presentado por Douglas Engelbart en otoño de 1968, que incluía un ratón y una interfaz gráfica de usuario."\n    },\n    {\n        "question": "¿Qué evento marcó un cambio en la interacción de los sistemas computarizados según la clase?    a) La invención de la máquina Pascalina.  b) La fundación de IBM.  c) La aparición de la computadora electromecánica Mark II.  d) La introducción del ratón y la interfaz gráfica de usuario en el prototipo de Douglas Engelbart.",\n        "answer": "d) La introducción del ratón y la interfaz gráfica de usuario en el prototipo de Douglas Engelbart. Explicación: La incorporación del ratón y la interfaz gráfica de usuario en el prototipo de Douglas Engelbart marcó un cambio significativo en la interacción de los sistemas computarizados."\n    }\n]', 'questions2': '[\n    {\n        "question": "¿Cuál fue el primer dispositivo de intercambio de información entre computadoras y otros mencionado en la clase?    a) Disquetes floppy.  b) Discos compactos.  c) Pen Drive.  d) Cassettes.",\n        
"answer": "a) Disquetes floppy. Explicación: Los disquetes floppy fueron mencionados como el primer dispositivo de intercambio de información entre computadoras y otros, creados en 1931 por IBM."\n    },\n    {\n        "question": "¿Qué dispositivo de almacenamiento 
secundario introducido en la década de los 80 era rígido, de colores y mucho más pequeño que los disquetes anteriores?    a) Discos compactos.  b) Cassettes.  c) Pen Drive.  d) 3.5 pulgadas.",\n        "answer": "d) 3.5 pulgadas. Explicación: Los dispositivos de almacenamiento secundario de 3.5 pulgadas, introducidos en la década de los 80, eran rígidos, de colores y mucho más pequeños que los disquetes anteriores, con una capacidad entre 720 y 440 kilobytes."\n    },\n    {\n        "question": "¿Cuál fue la primera red de Computadores del mundo mencionada en la clase?    a) ARPANET.  b) Internet.  c) Red privada de IBM.  d) Red Educativa Estatal.",\n        "answer": "a) ARPANET. Explicación: ARPANET fue mencionada como la primera red de Computadores del mundo, creada en 1968 por el Departamento de Defensa de los Estados Unidos, y eventualmente se convirtió en la columna vertebral de Internet."\n    },\n    {\n        "question": "¿Cómo se define una computadora según la información proporcionada en la clase?    a) Como una máquina electrónica digital programable.  b) Como una máquina electromecánica sin capacidad de almacenamiento.  c) Como un dispositivo mecánico de cálculo.  d) Como un aparato de comunicación inalámbrica.",\n        "answer": "a) Como una máquina electrónica digital programable. Explicación: Según la información de la clase, una computadora se define como una máquina electrónica digital programable que procesa datos de entrada para obtener información mediante comandos y programas."\n    },\n    {\n        "question": "¿Qué es el hardware de una computadora según la clase?    a) La parte intangible, como programas y datos.  b) La estructura física, circuitos electrónicos, teclado, ratón, etc.  c) La CPU y la memoria.  d) La unidad de entrada y salida de datos.",\n        "answer": "b) La estructura física, circuitos electrónicos, teclado, ratón, etc. Explicación: En la clase se menciona que el hardware de una computadora es su parte física, que incluye circuitos electrónicos, teclado, ratón, entre otros elementos."\n    },\n    {\n        "question": "¿Qué tipo de computadora se menciona que fue usada en la Segunda Guerra Mundial para aplicaciones militares?    a) Computadoras digitales.  b) Computadoras analógicas. 
 c) Computadoras híbridas.  d) Computadoras mecánicas.",\n        "answer": "b) Computadoras analógicas. Explicación: En la Segunda Guerra Mundial se utilizaron computadoras analógicas para aplicaciones militares, según lo mencionado en la clase."\n    }\n]', 'title': '"Título: Evolución y Impacto de la Computadora: Desde sus Orígenes Históricos hasta las Redes y Dispositivos Modernos"', 'status': 'success'}
"""