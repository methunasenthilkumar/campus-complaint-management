import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api, saveSession } from "../services/api";

export default function AuthPage({ role, mode }) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const isAdmin = role === "admin";
  const [form, setForm] = useState({ studentName: "", studentId: "", department: "", email: "", password: "", username: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const path = isAdmin ? "/auth/admin/login" : isRegister ? "/auth/student/register" : "/auth/student/login";
      const data = await api(path, { method: "POST", body: JSON.stringify(form) });
      saveSession(data.token, data.user);
      navigate(isAdmin ? "/admin" : "/student");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  return (
    <Layout>
      <section className="auth-page">
        <div className="auth-card">
          <Link className="back-link" to="/">← Back to home</Link>
          <span className="eyebrow">{isAdmin ? "Administrator" : "Student portal"}</span>
          <h1>{isAdmin ? "Admin sign in" : isRegister ? "Create account" : "Welcome back"}</h1>
          <p className="muted">{isAdmin ? "Manage and resolve campus complaints." : isRegister ? "Register to submit and track complaints." : "Sign in to your complaint dashboard."}</p>
          {message && <div className="alert error">{message}</div>}
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <label>Full name<input name="studentName" value={form.studentName} onChange={update} required /></label>
                <label>Student ID<input name="studentId" value={form.studentId} onChange={update} required /></label>
                <label>Department
                  <select name="department" value={form.department} onChange={update} required>
                    <option value="">Select department</option>
                    {["Computer Science", "Electronics", "Civil Engineering", "Mechanical Engineering", "Management"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </>
            )}
            <label>{isAdmin ? "Email address" : "Email address"}<input type="email" name="email" value={form.email} onChange={update} required /></label>
            <label>Password<input type="password" name="password" value={form.password} onChange={update} required /></label>
            <button className="btn btn-primary full" disabled={loading}>{loading ? "Please wait…" : isRegister ? "Create account" : "Sign in"}</button>
          </form>
          {!isAdmin && <p className="auth-switch">{isRegister ? "Already registered?" : "New student?"} <Link to={isRegister ? "/student/login" : "/student/register"}>{isRegister ? "Sign in" : "Create account"}</Link></p>}
        </div>
      </section>
    </Layout>
  );
}
