import React, { useState, useEffect } from "react";
import { updateQuestion } from "../api";

export default function InterviewPlan({ plan }) {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editExpected, setEditExpected] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (plan && plan.questions) {
      setQuestions(plan.questions);
    } else {
      setQuestions([]);
    }
  }, [plan]);

  if (!plan) return null;

  const handleStatusChange = async (questionId, newStatus) => {
    setActionLoadingId(questionId);
    try {
      const updatedQ = await updateQuestion(questionId, newStatus);
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, status: updatedQ.status } : q))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating question status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const startEditing = (q) => {
    setEditingId(q.id);
    setEditText(q.text);
    setEditExpected(q.expected_points || "");
  };

  const saveEdit = async (questionId) => {
    setActionLoadingId(questionId);
    try {
      // Set status to 'edited' or keep current one if already approved
      const currentQ = questions.find((q) => q.id === questionId);
      const newStatus = currentQ.status === "approved" ? "approved" : "edited";
      const updatedQ = await updateQuestion(questionId, newStatus, editText);
      
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, text: updatedQ.text, status: updatedQ.status, expected_points: editExpected }
            : q
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save edits:", err);
      alert("Error saving edits.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const copyToClipboard = () => {
    const approved = questions.filter((q) => q.status === "approved");
    if (approved.length === 0) {
      alert("Please approve some questions first before exporting!");
      return;
    }

    const text = approved
      .map(
        (q, idx) =>
          `${idx + 1}. [${q.difficulty}] Question: ${q.text}\n   Expected Answer: ${q.expected_points}\n`
      )
      .join("\n");

    navigator.clipboard.writeText(text);
    alert("Approved questions copied to clipboard!");
  };

  const strengths = plan.strengths || [];
  const missingSkills = plan.missing_skills || [];

  return (
    <div className="plan-container animate-fade-in">
      <div className="plan-header">
        <span className="plan-badge">Structured Interview Dashboard</span>
        <h2>Interview Plan & Question Recommendation</h2>
      </div>

      {/* Candidate Strengths & Missing Skills Grid */}
      <div className="form-grid" style={{ marginBottom: "32px" }}>
        <div className="form-card" style={{ height: "auto", minHeight: "200px" }}>
          <div className="card-header">
            <span className="card-icon" style={{ color: "#10b981" }}>✔️</span>
            <h2 style={{ color: "#10b981" }}>Candidate Strengths</h2>
          </div>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            {strengths.map((s, i) => (
              <li key={i} className="plan-li" style={{ color: "#d1d5db" }}>{s}</li>
            ))}
            {strengths.length === 0 && <p className="plan-p">No specific strengths annotated.</p>}
          </ul>
        </div>

        <div className="form-card" style={{ height: "auto", minHeight: "200px" }}>
          <div className="card-header">
            <span className="card-icon" style={{ color: "#f59e0b" }}>🔍</span>
            <h2 style={{ color: "#f59e0b" }}>Missing / Unclear Skills</h2>
          </div>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            {missingSkills.map((m, i) => (
              <li key={i} className="plan-li" style={{ color: "#d1d5db" }}>{m}</li>
            ))}
            {missingSkills.length === 0 && <p className="plan-p">No missing skills flagged.</p>}
          </ul>
        </div>
      </div>

      {/* Recommended Questions Section */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
          Recommended Questions ({questions.length})
        </h3>
        <p className="card-subtitle" style={{ marginBottom: "24px" }}>
          Review, edit, and approve questions for the interview plan. Only approved questions will be exported.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {questions.map((q) => {
            const isEditing = editingId === q.id;
            const isApproved = q.status === "approved";
            const isRejected = q.status === "rejected";
            const isEdited = q.status === "edited";
            const isLoading = actionLoadingId === q.id;

            return (
              <div
                key={q.id}
                className="form-card"
                style={{
                  borderColor: isApproved
                    ? "rgba(16, 185, 129, 0.4)"
                    : isRejected
                    ? "rgba(239, 68, 68, 0.2)"
                    : "var(--border-color)",
                  opacity: isRejected ? 0.6 : 1,
                  background: isApproved
                    ? "rgba(16, 185, 129, 0.03)"
                    : isRejected
                    ? "rgba(239, 68, 68, 0.01)"
                    : "var(--card-bg)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span
                    className="plan-badge"
                    style={{
                      background:
                        q.difficulty === "Easy"
                          ? "rgba(16, 185, 129, 0.15)"
                          : q.difficulty === "Hard"
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(245, 158, 11, 0.15)",
                      color:
                        q.difficulty === "Easy"
                          ? "#34d399"
                          : q.difficulty === "Hard"
                          ? "#f87171"
                          : "#fbbf24",
                      border: "none",
                    }}
                  >
                    {q.difficulty}
                  </span>

                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: isApproved
                        ? "#065f46"
                        : isRejected
                        ? "#7f1d1d"
                        : isEdited
                        ? "#1e3a8a"
                        : "#374151",
                      color: "#fff",
                    }}
                  >
                    {q.status.toUpperCase()}
                  </span>
                </div>

                {/* Edit / View Question Text */}
                <div style={{ marginBottom: "16px" }}>
                  {isEditing ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="custom-textarea"
                      style={{ height: "80px", marginBottom: "8px" }}
                    />
                  ) : (
                    <p style={{ fontSize: "1.1rem", fontWeight: "500", color: "#fff", marginBottom: "8px" }}>
                      {q.text}
                    </p>
                  )}
                  
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <strong>Rationale: </strong>{q.reason}
                  </p>
                </div>

                {/* Expected Answers Key */}
                <div
                  style={{
                    background: "rgba(15, 16, 28, 0.4)",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #818cf8",
                    marginBottom: "20px",
                  }}
                >
                  <strong style={{ fontSize: "0.9rem", color: "#818cf8", display: "block", marginBottom: "4px" }}>
                    Expected Answer Points
                  </strong>
                  {isEditing ? (
                    <textarea
                      value={editExpected}
                      onChange={(e) => setEditExpected(e.target.value)}
                      className="custom-textarea"
                      style={{ height: "60px" }}
                    />
                  ) : (
                    <p style={{ fontSize: "0.92rem", color: "#d1d5db" }}>
                      {q.expected_points || q.expected_answer || "N/A"}
                    </p>
                  )}
                </div>

                {/* Actions Row */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(q.id)}
                        disabled={isLoading}
                        className="glow-button"
                        style={{ padding: "8px 16px", fontSize: "0.9rem", boxShadow: "none" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        disabled={isLoading}
                        className="glow-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.9rem",
                          background: "#374151",
                          boxShadow: "none",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(q)}
                        disabled={isLoading}
                        className="glow-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.9rem",
                          background: "rgba(255,255,255,0.05)",
                          color: "#fff",
                          boxShadow: "none",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleStatusChange(q.id, "approved")}
                        disabled={isLoading || isApproved}
                        className="glow-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.9rem",
                          background: isApproved ? "#059669" : "rgba(16, 185, 129, 0.15)",
                          color: "#34d399",
                          boxShadow: "none",
                        }}
                      >
                        ✔️ Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(q.id, "rejected")}
                        disabled={isLoading || isRejected}
                        className="glow-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.9rem",
                          background: isRejected ? "#dc2626" : "rgba(239, 68, 68, 0.15)",
                          color: "#f87171",
                          boxShadow: "none",
                        }}
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Section */}
      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px", display: "flex", justifyContent: "center" }}>
        <button onClick={copyToClipboard} className="glow-button">
          📋 Copy Approved Questions to Clipboard
        </button>
      </div>
    </div>
  );
}
