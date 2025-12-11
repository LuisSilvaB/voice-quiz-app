#!/usr/bin/env python3
"""
Script de diagnóstico para verificar la configuración de OpenRouter
"""

import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


def check_openrouter_config():
    print("=" * 60)
    print("🔍 DIAGNÓSTICO DE CONFIGURACIÓN DE OPENROUTER")
    print("=" * 60)

    # Verificar API Key
    api_key = os.getenv("OPENROUTER_API_KEY", "")

    if not api_key:
        print("❌ ERROR: OPENROUTER_API_KEY no está configurada")
        print("\n📝 Solución:")
        print("1. Crea un archivo .env en voice-quiz-back/")
        print("2. Agrega: OPENROUTER_API_KEY=sk-or-v1-xxxxx")
        return False

    if not api_key.startswith("sk-or-v1-"):
        print(f"⚠️  ADVERTENCIA: La API key no tiene el formato correcto")
        print(f"   Formato esperado: sk-or-v1-...")
        print(f"   Formato actual: {api_key[:15]}...")
        return False

    print(f"✅ OPENROUTER_API_KEY configurada correctamente")
    print(f"   Key: {api_key[:20]}...{api_key[-4:]}")

    # Verificar que openai esté instalado
    try:
        import openai

        print(f"✅ Librería openai instalada: v{openai.__version__}")
    except ImportError:
        print("❌ ERROR: Librería openai no está instalada")
        print("   Ejecuta: uv pip install openai")
        return False

    # Probar conexión
    print("\n🔌 Probando conexión con OpenRouter...")
    try:
        from app.api.ai_api_client import query_ai

        test_messages = [{"role": "user", "content": "Di solo 'OK' si me entiendes"}]

        response = query_ai(test_messages)
        print(f"✅ Conexión exitosa!")
        print(f"   Respuesta del modelo: {response[:50]}...")
        return True

    except Exception as e:
        print(f"❌ ERROR al conectar con OpenRouter:")
        print(f"   {str(e)}")
        return False


if __name__ == "__main__":
    success = check_openrouter_config()

    print("\n" + "=" * 60)
    if success:
        print("✅ TODO CONFIGURADO CORRECTAMENTE")
        print("\n📌 Próximos pasos:")
        print("1. Asegúrate de configurar la misma key en Railway")
        print("2. Ve a Railway → Variables → OPENROUTER_API_KEY")
        print("3. Espera el redeploy automático")
    else:
        print("❌ HAY PROBLEMAS DE CONFIGURACIÓN")
        print("\n📌 Revisa los errores arriba y corrígelos")
    print("=" * 60)
