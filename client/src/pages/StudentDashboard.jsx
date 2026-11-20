import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api, getSession } from "../services/api";

const categories = ["Classroom", "Projector", "Wi-Fi", "Drinking Water", "Laboratory Equipment", "Washroom", "Hostel Maintenance", "Electrical Issues", "Other"];

export default function StudentDashboard() {
  const user = getSession();
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ category: "", description: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setComplaints((await api("/complaints/my-complaints")).complaints); }
    catch (error) { setError(error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user?.role === "student") load(); }, []);
  if (!user || user.role !== "student") return <Navigate to="/student/login" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const data = await api("/complaints", { method: "POST", body: JSON.stringify(form) });
      setMessage(`Complaint submitted successfully. ID: ${data.complaint.complaintId}`);
      setForm({ category: "", description: "" });
      await load();
    } catch (error) { setError(error.message); }
  };

  const track = async (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    setMessage("");
    setError("");
    try {
      const data = await api(`/complaints/track/${encodeURIComponent(search.trim())}`);
      setComplaints([data.complaint]);
      setMessage(`Complaint ${data.complaint.complaintId} is ${data.complaint.status}`);
    } catch (error) { setError(error.message); setComplaints([]); }
  };

  return (
    <Layout>
      <section className="dashboard">
        <div className="page-heading">
          <div><span className="eyebrow">Student dashboard</span><h1>Welcome, {user.name}</h1><p>{user.studentId} · {user.department}</p></div>
        </div>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        <div className="student-grid">
          <section className="panel complaint-form">
            <div className="panel-heading"><div><small>New request</small><h2>Submit a complaint</h2></div></div>
            <form onSubmit={submit}>
              <label>Complaint category
                <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required>
                  <option value="">Select category</option>{categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>Description<textarea rows="5" minLength="10" maxLength="2000" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the issue clearly…" required /></label>
              <button className="btn btn-primary full">Submit complaint</button>
            </form>
          </section>
          <section className="panel complaints-panel">
            <div className="panel-heading"><div><small>Your records</small><h2>My complaints</h2></div><span className="count-badge">{complaints.length}</span></div>
            <form className="search-row" onSubmit={track}>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by complaint ID" />
              <button className="btn btn-navy" type="submit">Track</button>
              <button className="btn btn-ghost-dark" type="button" onClick={load}>Reset</button>
            </form>
            {loading ? <div className="empty-state">Loading complaints…</div> : complaints.length === 0 ? <div className="empty-state">No complaints found.</div> : (
              <div className="complaint-list">
                {complaints.map((item) => (
                  <article className="complaint-card" key={item._id}>
                    <div className="complaint-card-top"><strong>{item.complaintId}</strong><StatusBadge status={item.status} /></div>
                    <span className="category-label">{item.category}</span>
                    <p>{item.description}</p>
                    <div className="complaint-dates"><span>Submitted {new Date(item.createdAt).toLocaleDateString()}</span><span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span></div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </Layout>
  );
}
