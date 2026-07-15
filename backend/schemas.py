from pydantic import BaseModel
from enum import Enum

class CandidateCreate(BaseModel):
    resume: str

class JobCreate(BaseModel):
    description: str

class InterviewPlanCreate(BaseModel):
    candidate_id: int
    job_id: int
    plan: str

class QuestionStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    edited = "edited"

class QuestionCreate(BaseModel):
    plan_id: int
    text: str
    difficulty: str
    expected_points: str
    reason: str

class QuestionUpdate(BaseModel):
    status: QuestionStatus
    text: str | None = None

class GeneratePlanRequest(BaseModel):
    resume: str
    description: str
