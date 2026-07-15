import React from "react";

export default function ResumeForm({ resume, setResume }) {
  return (
    <div className="form-card">
      <div className="card-header">
        <div className="card-icon">📄</div>
        <h2>Candidate Resume</h2>
      </div>
      <p className="card-subtitle">Paste the candidate's professional resume or CV text below.</p>
      <textarea 
        value={resume} 
        onChange={(e) => setResume(e.target.value)} 
        placeholder="Experience, education, skills, projects..."
        className="custom-textarea"
      />
    </div>
  );
}
