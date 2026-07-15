import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import JobForm from "./components/JobForm";
import InterviewPlan from "./components/InterviewPlan";
import { generatePlan } from "./api";
import "./index.css";

function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!resume.trim() || !job.trim()) {
      setError("Please fill out both the Resume and the Job Description.");
      return;
    }
    
    setLoading(true);
    setError("");
    setPlan("");
    
    try {
      console.log("Sending request to backend with Resume & Job Description...");
      const result = await generatePlan(resume, job);
      console.log("Response received from backend:", result);
      setPlan(result.plan);
    } catch (err) {
      console.error("API call failed:", err);
      let errorMsg = "Failed to connect to the backend server. Please verify the backend is running and the database is configured.";
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === "string") {
          errorMsg = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail
            .map((d) => `${d.loc ? d.loc.join(".") : ""}: ${d.msg}`)
            .join(", ");
        } else {
          errorMsg = JSON.stringify(err.response.data.detail);
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Intelligent Interview Engine</h1>
        <p>AI-Powered Resume Analysis & Interview Question Recommendation</p>
      </header>

      <div className="form-grid">
        <ResumeForm resume={resume} setResume={setResume} />
        <JobForm job={job} setJob={setJob} />
      </div>

      {error && (
        <div className="form-card animate-fade-in" style={{ borderColor: "#ef4444", marginBottom: "24px" }}>
          <div className="card-header">
            <span className="card-icon">⚠️</span>
            <h2 style={{ color: "#ef4444" }}>Error</h2>
          </div>
          <p style={{ color: "#fca5a5" }}>{error}</p>
        </div>
      )}

      <div className="action-section">
        <button 
          onClick={handleGenerate} 
          disabled={loading} 
          className="glow-button"
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span>Generating Plan...</span>
            </>
          ) : (
            <>
              <span>✨ Generate Interview Plan</span>
            </>
          )}
        </button>
      </div>

      <InterviewPlan plan={plan} />
    </div>
  );
}

export default App;
