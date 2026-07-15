from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import models
import schemas
import ai
import json

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------
# Interview Plan Generation
# -------------------------
@app.post("/generate-plan/")
def generate_plan(request: schemas.GeneratePlanRequest, db: Session = Depends(get_db)):
    # 1. Save Candidate Resume
    new_candidate = models.Candidate(resume=request.resume)
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)
    
    # 2. Save Job Description
    new_job = models.JobDescription(description=request.description)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    # 3. Generate Plan text via AI (JSON formatted)
    plan_text = ai.generate_interview_plan(request.resume, request.description)
    
    try:
        plan_parsed = json.loads(plan_text)
    except Exception:
        plan_parsed = {"strengths": [], "missing_skills": [], "questions": []}

    # 4. Save Interview Plan
    new_plan = models.InterviewPlan(candidate_id=new_candidate.id, job_id=new_job.id, plan=plan_text)
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    
    # 5. Populate Questions Table from the generated plan
    questions_list = plan_parsed.get("questions", [])
    saved_questions = []
    
    for q in questions_list:
        new_q = models.InterviewQuestion(
            plan_id=new_plan.id,
            text=q.get("question", ""),
            difficulty=q.get("difficulty", "Medium"),
            expected_points=q.get("expected_answer", ""),
            reason=q.get("reason", ""),
            status=models.QuestionStatus.pending
        )
        db.add(new_q)
        try:
            db.commit()
            db.refresh(new_q)
            saved_questions.append({
                "id": new_q.id,
                "plan_id": new_q.plan_id,
                "text": new_q.text,
                "difficulty": new_q.difficulty,
                "expected_points": new_q.expected_points,
                "reason": new_q.reason,
                "status": new_q.status.value
            })
        except Exception:
            db.rollback() # Skip duplicate question if it violates unique constraint

    structured_plan = {
        "plan_id": new_plan.id,
        "strengths": plan_parsed.get("strengths", []),
        "missing_skills": plan_parsed.get("missing_skills", []),
        "questions": saved_questions
    }
    
    return {"plan": structured_plan}

# -------------------------
# Question Management
# -------------------------
@app.post("/questions/")
def add_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    new_q = models.InterviewQuestion(
        plan_id=question.plan_id,
        text=question.text,
        difficulty=question.difficulty,
        expected_points=question.expected_points,
        reason=question.reason,
        status=models.QuestionStatus.pending
    )
    db.add(new_q)
    db.commit()
    db.refresh(new_q)
    return new_q

@app.put("/questions/{question_id}")
def update_question(question_id: int, update: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    q = db.query(models.InterviewQuestion).filter(models.InterviewQuestion.id == question_id).first()
    if not q:
        return {"error": "Question not found"}
    
    if update.text is not None:
        q.text = update.text
    
    # Map pydantic schema enum value to SQLAlchemy model enum
    status_str = update.status.value
    q.status = models.QuestionStatus[status_str]
    
    db.commit()
    db.refresh(q)
    return q

@app.get("/questions/{plan_id}")
def list_questions(plan_id: int, db: Session = Depends(get_db)):
    return db.query(models.InterviewQuestion).filter(models.InterviewQuestion.plan_id == plan_id).all()
