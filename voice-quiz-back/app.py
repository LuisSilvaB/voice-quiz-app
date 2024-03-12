from flask import Flask, jsonify, request
from flask_cors import CORS

from langchain.text_splitter import CharacterTextSplitter

from usellm import Message, Options, UseLLM

# Initialize the service
service = UseLLM(service_url="https://usellm.org/api/llm")

# Prepare the conversation
template_system = """
Eres un experto en crear preguntas basadas solamente en transcripciones de grabaciones de sesiones clase.
Tu objetivo es reforzar el aprendizaje de los estudiantes para que comprendan toda la informacion importante que el docente enseño durante la clase.
Haces esto creando questionarios con preguntas sobre el texto transcrito que el profesor dijo durante la clase y que te proporcionara en los siguiente mensajes.
El docente desea que realices preguntas solo del tipo abiertas para retroalimentar lo que se dijo en clase.
Las preguntas debe tener la siguiente estructura y las presentaras en el siguiente formato segun el tipo de pregunta:

¿ (Aqui va la pregunta) ?
Resp: (Aqui va la respuesta)
-
¿ (Aqui va la pregunta) ?
Resp: (Aqui va la respuesta)
-
[...]
"""

def split_text_into_chunks(text, chunk_size):
    chunks = []
    start_index = 0
    while start_index < len(text):
        end_index = min(start_index + chunk_size, len(text))
        chunks.append(text[start_index:end_index])
        start_index = end_index
    return chunks

app = Flask(__name__)

@app.route('/api/example', methods=['GET'])
def get_example():
    data = {
        'message': 'This is an example API endpoint',
        'status': 'success'
    }
    return jsonify(data)


#1. Recibir la transcripción de la sesión
@app.route('/api/docs', methods=['POST'])
def process_docs():

    session_name = request.form.get('session_name')  # Nombre de la sesión

    #1. validar entrada de datos
    if 'documents' not in request.files:
       return 'No documents found', 400
    
    documents = request.files.getlist('documents') #Receive data from .txt files
    
    if len(documents) == 0 or all(file.filename == '' for file in documents):
        return 'No documents found2', 400
    
    # Leer el contenido de cada archivo individualmente y concatenarlo
    transcript_text = ""
    for file in documents:
        transcript_text += file.read().decode()
        
    #2. Dividir los documentos en partes mas pequeñas.
    chunk=CharacterTextSplitter(separator=".", chunk_size=2000, chunk_overlap=0)
    trans_docs = chunk.create_documents([transcript_text])

    primer_fragmento = trans_docs[0].page_content
    print(primer_fragmento)
    #3. Preparar la conversación

    # Prepare the conversation for the user role

    
    template_user =f"""
    Genera 5 preguntas de lo mas importante que se dijo en la transcripcion: {primer_fragmento}
    """
    messages = [
        Message(role="system", content=template_system),
        Message(role="user", content=template_user)
    ]

    options = Options(messages=messages)

    # Interact with the service
    response = service.chat(options)

    # Print the assistant's response
    print(response.content)

    response = {'success': True}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)


"""
"POST /api/docs HTTP/1.1" 200 -
 * Detected change in 'C:\\Users\\Hp\\Documents\\workspace-taller\\proyecto-original\\voice-quiz-app\\voice-quiz-back\\app.py', reloading
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 120-821-688
Buenos días a todos, hoy hacen nos adentraremos en un tema fascinante, la teoría de la relatividad. Como saben, esta teoría revolucionaria fue propuesta por Albert Einstein en el siglo 20, ya transformado nuestra comprensión del universo. Primero quiero discutir los fundamentos de la teoría. La relatividad especial, 
desarrollada en 1905. Establece que las leyes de la física son las mismas para todos los observadores. No acelerados y que la velocidad de la luz en el vacío es constante. Independientemente del movimiento del observador o de la fuente de luz. Esto significa que el tiempo y el espacio son relativos y están entrelazados en una entidad única llamada espacio tiempo. Para ilustrar esto, imaginemos dos eventos que ocurren simultáneamente para un observador estacionario. Si todo, si otro observador entra en movimiento en relación con el primero, esos mismos eventos pueden parecer. Que no ocurren simultáneamente debido a la dilatación 
 describe como la gravedad es el resultado de la curvatura del espacio tiempo causada por la presencia de masa y energía. Para si describe como la gravedad es mplificar, podríamos imaginar el espacio tiempo como una sabia sábana elástica, donde los objetos masivos, como planetas y estrelel espacio tiempo como una sablas, crean depresiones que hacen que otros objetos se muevan a lo largo de la. Trayectoria curva. Un ejemplo clásico es la explic a lo largo de la. Trayectoriaación de por qué la manzana cae del árbol. No es solo una atracción gravitacional de la tierra, sino la curvatura del espacio tieerra, sino la curvatura del esmpo alrededor de la masa de la tierra que determina el movimiento de la manzana hacia el suelo. Espero que esta introducción les ción les haya dado la comprens
haya dado la comprensión básica de la teoría de la relatividad ahora. Vamos a profundizar en algunos conceptos clave y a explorarel universo observado. Muchas  sus indicaciones en el universo observado. Muchas gracias
¿Qué teoría revolucionaria fue propuesta por Albert Einstein en el siglo 20?
Resp: La teoría de la relatividad.
-
¿En qué año fue desarrollada la relatividad especial y qué establece?
Resp: Fue desarrollada en 1905 y establece que las leyes de la física son las mismas para todos los observadores no acelerados, y que la velocidad de la luz en que la velocidad de la luz en el vacío es constante.
-
¿Cómo describe la teoría de la relatividad general la gravedad?
Resp: Describe que la gravedad es el resultado de la curvatura del espacio tiempo causada por la presencia de masa y energía.    
-
¿Qué analogía se utiliza para explicar cómo los objetos masivos curvan el espacio tiempo?
Resp: Se utiliza la analogía de imaginar el espacio tiempo como una sábana elástica donde los objetos masivos crean depresiones. 
-
¿Qué determina el movimiento de la manzana hacia el suelo según la teoría de la relatividad general?
Resp: La curvatura del espacio tiempo alrededor de la masa de la tierra.
127.0.0.1 - - [12/Mar/2024 02:57:50] "POST /api/docs HTTP/1.1" 200 -
"""