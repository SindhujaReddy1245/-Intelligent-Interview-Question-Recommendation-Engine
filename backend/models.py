from sqlalchemy import Column, Integer, String, Text, Enum
from database import Base
import enum

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    resume = Column(Text)

class JobDescription(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text)

class InterviewPlan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer)
    job_id = Column(Integer)
    plan = Column(Text)

class QuestionStatus(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    edited = "edited"

class InterviewQuestion(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, index=True)
    text = Column(Text, unique=True)   # avoid duplicates
    difficulty = Column(String)
    expected_points = Column(Text)
    reason = Column(Text)
    status = Column(Enum(QuestionStatus), default=QuestionStatus.pending)
