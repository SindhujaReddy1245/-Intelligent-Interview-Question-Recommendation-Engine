import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8081" });

export const generatePlan = async (resume, job) => {
  const res = await API.post("/generate-plan/", { resume, description: job });
  return res.data;
};

export const updateQuestion = async (questionId, status, text = null) => {
  const payload = { status };
  if (text !== null) {
    payload.text = text;
  }
  const res = await API.put(`/questions/${questionId}`, payload);
  return res.data;
};
