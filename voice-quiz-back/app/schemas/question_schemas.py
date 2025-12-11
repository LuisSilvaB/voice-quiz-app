# app/schemas/question_schemas.py
"""
Pydantic schemas for structured AI responses
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class Question(BaseModel):
    """Schema for a single question"""

    questionTitle: str = Field(..., description="The question text")
    alternatives: Optional[List[str]] = Field(
        None, description="List of answer alternatives (null for open questions)"
    )
    answer: str = Field(
        ..., description="The correct answer with explanation based on class content"
    )
    correctIndex: Optional[int] = Field(
        None, description="Index of correct answer (0-based, null for open questions)"
    )


class QuizResponse(BaseModel):
    """Schema for the complete quiz response"""

    title: str = Field(..., description="General title for the entire fragment")
    questions: List[Question] = Field(
        ..., description="List of questions generated from the transcript"
    )


class TitleResponse(BaseModel):
    """Schema for title generation response"""

    title: str = Field(
        ...,
        max_length=100,
        description="A concise title (max 20 words) for the transcript fragment",
    )
