import React from "react";

export default function JobForm({ job, setJob }) {
  return (
    <div className="form-card">
      <div className="card-header">
        <div className="card-icon">💼</div>
        <h2>Job Description</h2>
      </div>
      <p className="card-subtitle">Paste the requirements and description of the target role below.</p>
      <textarea 
        value={job} 
        onChange={(e) => setJob(e.target.value)} 
        placeholder="Role responsibilities, required skills, qualifications..."
        className="custom-textarea"
      />
    </div>
  );
}
