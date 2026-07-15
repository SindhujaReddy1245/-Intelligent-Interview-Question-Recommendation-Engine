import requests
import os

# Use environment variable if present, otherwise fallback to placeholder
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "YOUR_OPENROUTER_API_KEY_HERE")

def generate_interview_plan(resume: str, job: str):
    prompt = f"""
    Analyze the following resume and job description.
    Resume: {resume}
    Job Description: {job}

    You must return a raw JSON object (and only JSON, no markdown code blocks) with the following structure:
    {{
        "strengths": [
            "candidate strength 1",
            "candidate strength 2"
        ],
        "missing_skills": [
            "missing or unclear skill 1",
            "missing or unclear skill 2"
        ],
        "questions": [
            {{
                "id": 1,
                "question": "question text?",
                "difficulty": "Easy|Medium|Hard",
                "expected_answer": "Expected points to look for in the candidate's answer",
                "reason": "Why this question is relevant to the job requirements and candidate experience"
            }}
        ]
    }}

    Avoid any duplicate, repetitive, or irrelevant questions. Provide 4 to 6 high-quality, highly relevant questions.
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
        json={
            "model": "openai/gpt-4o-mini",
            "response_format": {"type": "json_object"},
            "messages": [{"role": "user", "content": prompt}]
        }
    )
    
    # Handle response errors gracefully
    if response.status_code != 200:
        raise Exception(f"OpenRouter API returned error {response.status_code}: {response.text}")
        
    return response.json()["choices"][0]["message"]["content"]
