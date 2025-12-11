# app/utils/helpers.py
from app.templates.system_templates import (
    template_system_multiple_answer_questions,
    template_system_open_questions,
    template_system_true_or_false,
)


def select_template_system(kindquestion):
    if kindquestion == "multiple_answer":
        return template_system_multiple_answer_questions
    elif kindquestion == "open_answer":
        return template_system_open_questions
    elif kindquestion == "true_or_false":
        return template_system_true_or_false


def validate_documents(files):
    if "documents" not in files:
        return False
    documents = files.getlist("documents")
    if not documents or all(file.filename == "" for file in documents):
        return False
    return True


def read_documents(files):
    return [file.read().decode() for file in files.getlist("documents")]
