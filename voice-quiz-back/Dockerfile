# Usar una imagen base de Python
FROM python:3.11.9

# Establecer un directorio de trabajo
WORKDIR /

# Copiar los archivos de requisitos e instalar las dependencias
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copiar el resto de los archivos de la aplicación
COPY . .

# Comando para ejecutar la aplicación
CMD ["python", "run.py"]