# Intelligent Interview Question Recommendation Engine

An AI-powered interview preparation dashboard. The system accepts a candidate's resume and a target job description, analyzes the data to extract strengths and skill gaps, and recommends targeted interview questions (categorized by difficulty, expected answer points, and rationale). Interviewers can interactively edit, approve, or reject these questions before exporting the final questionnaire.

---

## 🚀 Setup & Installation

### Prerequisites
* Python 3.10+
* Node.js v18+ & npm
* PostgreSQL (Local or Supabase Cloud instance)

---

### ⚙️ Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the environment variables:
   Create a `.env` file or export the following variable locally:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

5. Run the server:
   ```bash
   python run.py
   ```
   * The API server will start on **`http://localhost:8081`**.
   * Interactive Swagger docs can be accessed at **`http://localhost:8081/docs`**.

---

### 🎨 Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Configure the local environment:
   Create a `.env` file in the `frontend` root:
   ```env
   PORT=3001
   ```

4. Run the React app:
   ```bash
   npm start
   ```
   * The application opens in the browser at **`http://localhost:3001`**.

---

## 🛠️ Assumptions & Trade-offs

1. **Structured JSON Mode**: Instead of generating a single markdown text string, the LLM is instructed to return structured JSON. This guarantees that strengths, missing skills, and recommended questions can be cleanly separated and saved as individual relational items in the database.
2. **In-place Status Synchronization**: Instead of requiring a bulk save, each approve/reject/edit action updates its record in the Supabase PostgreSQL database in real time. This minimizes risk of data loss.
3. **Password URL Encoding**: PostgreSQL passwords containing special characters (e.g. `@`) are URL-encoded in Python before being passed to SQLAlchemy to prevent connection parser errors.
4. **Clipboard Export**: The app supports exporting finalized plans by copying only the approved list of questions (and their expected answers) to the clipboard.

---

## 🤖 AI Tools Used & Implementation Rationale

1. **OpenRouter API (`openai/gpt-4o-mini`)**:
   * Used for low-latency, highly accurate text parsing and formatting in structured JSON mode.
   * Instructed via prompt engineering to filter out redundant or overlapping questions during generation.
2. **Antigravity AI (Google DeepMind)**:
   * Used to code structure, design the responsive glassmorphism UI, configure database connections, debug relative import errors, and handle git version control commands safely.

---

## 🧪 Verification and Tests

To run automated checks:
1. **DB Verification test**:
   ```bash
   cd backend
   python -c "import database, models; models.Base.metadata.create_all(bind=database.engine); print('Database Connection Successful!')"
   ```
   This verifies connection viability, authorization credentials, and SQLAlchemy schemas.
