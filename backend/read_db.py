import sys
sys.path.append('.')
import database
import models

db = database.SessionLocal()
try:
    plans = db.query(models.InterviewPlan).all()
    print(f"Total plans in DB: {len(plans)}")
    for p in plans:
        print(f"Plan ID: {p.id}")
        print(f"Candidate ID: {p.candidate_id}")
        print(f"Job ID: {p.job_id}")
        print(f"Plan length: {len(p.plan) if p.plan else 0}")
        print(f"Plan preview: {p.plan[:200] if p.plan else 'None'}")
        print("-" * 40)
except Exception as e:
    print("Error reading database:", e)
finally:
    db.close()
