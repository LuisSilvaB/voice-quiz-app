# app/routes/routes.py
from flask import Blueprint, jsonify

from app.services.fireworks_service import process_docs as process_docs_fireworks
from app.services.together_service import (
    process_docs as process_docs_together,
)
from app.services.together_service import (
    process_title_docs as process_title_docs_together,
)
from app.services.usellm_service import (
    process_docs as process_docs_usellm,
)
from app.services.usellm_service import (
    process_title_docs as process_title_docs_usellm,
)

api_blueprint = Blueprint("llm_services_blueprint", __name__)


@api_blueprint.route("/api/example", methods=["GET"])
def get_example():
    data = {"message": "This is an example API endpoint", "status": "success"}
    return jsonify(data)


@api_blueprint.route("/api/title", methods=["POST"])
def process_title():
    return process_title_docs_usellm()


@api_blueprint.route("/api/title/v2", methods=["POST"])
def process_title_v2():
    return process_title_docs_together()


@api_blueprint.route("/api/docs/v1", methods=["POST"])
def process_docs_v1():
    return process_docs_usellm()


@api_blueprint.route("/api/docs/v2", methods=["POST"])
def process_docs_v2():
    return process_docs_fireworks()


@api_blueprint.route("/api/docs/v3", methods=["POST"])
def process_docs_v3():
    return process_docs_together()


# NEW: Structured output endpoints (100% reliable JSON)
@api_blueprint.route("/api/docs/structured", methods=["POST"])
def process_docs_structured_route():
    from app.services.structured_quiz_service import process_docs_structured

    return process_docs_structured()


@api_blueprint.route("/api/title/structured", methods=["POST"])
def process_title_structured_route():
    from app.services.structured_quiz_service import process_title_structured

    return process_title_structured()
