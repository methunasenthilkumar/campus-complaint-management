import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api, getSession } from "../services/api";

export default function AdminDashboard() {
  const user = getSession();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [filters, setFilters] = useState({ complaintId: "", studentName: "", department: "", category: "", status: "" });
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [all, statistics] = await Promise.all([api("/admin/complaints"), api("/admin/stats")]);
      setComplaints(all.complaints);
      setStats(statistics.stats);
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user?.role === "admin") load(); }, []);
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;

  const filter = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => { if (value) params.append(key, value); });
      const data = await api(`/admin/complaints/filter${params.toString() ? `?${params}` : ""}`);
      setComplaints(data.complaints);
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  };

  const reset = () => {
    setFilters({ complaintId: "", studentName: "", department: "", category: "", status: "" });
    load();
  };

  const updateStatus = async (status) => {
    if (!selected) return;
    setError("");
    setMessage("");
    try {
      const data = await api(`/admin/complaints/${selected.complaintId}/status`, { method: "PUT", body: JSON.stringify({ status }) });
      setSelected(data.complaint);
      setMessage("Complaint status updated successfully.");
      await load();
    } catch (error) { setError(error.message); }
  };

  const updateFilter = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });

  return (
    <Layout>
      <section className="dashboard admin-dashboard">
        <div className="page-heading">
          <div><span className="eyebrow">Administration</span><h1>Complaint management</h1><p>Review requests and update resolution progress.</p></div>
        </div>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        <div className="stats-grid">
          <article className="stat-card navy"><span>Total complaints</span><strong>{stats.total}</strong></article>
          <article className="stat-card orange"><span>Pending</span><strong>{stats.pending}</strong></article>
          <article className="stat-card blue"><span>In progress</span><strong>{stats.inProgress}</strong></article>
          <article className="stat-card green"><span>Resolved</span><strong>{stats.resolved}</strong></article>
        </div>
        <section className="panel admin-table-panel">
          <form className="filter-grid" onSubmit={filter}>
            <input name="complaintId" value={filters.complaintId} onChange={updateFilter} placeholder="Complaint ID" />
            <input name="studentName" value={filters.studentName} onChange={updateFilter} placeholder="Student name" />
            <select name="department" value={filters.department} onChange={updateFilter}><option value="">All departments</option>{["Computer Science", "Electronics", "Civil Engineering", "Mechanical Engineering", "Management"].map((item) => <option key={item}>{item}</option>)}</select>
            <select name="category" value={filters.category} onChange={updateFilter}><option value="">All categories</option>{["Classroom", "Projector", "Wi-Fi", "Drinking Water", "Laboratory Equipment", "Washroom", "Hostel Maintenance", "Electrical Issues", "Other"].map((item) => <option key={item}>{item}</option>)}</select>
            <select name="status" value={filters.status} onChange={updateFilter}><option value="">All statuses</option><option>Pending</option><option>In Progress</option><option>Resolved</option></select>
            <button className="btn btn-navy">Apply</button>
            <button className="btn btn-ghost-dark" type="button" onClick={reset}>Reset</button>
          </form>
          {loading ? <div className="empty-state">Loading complaints…</div> : complaints.length === 0 ? <div className="empty-state">No complaints match the selected filters.</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Student</th><th>Department</th><th>Category</th><th>Status</th><th>Updated</th><th></th></tr></thead>
                <tbody>{complaints.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.complaintId}</strong></td><td>{item.studentName}<small>{item.studentId}</small></td><td>{item.department}</td><td>{item.category}</td>
                    <td><StatusBadge status={item.status} /></td><td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-small" onClick={() => setSelected(item)}>View</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
        {selected && (
          <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
            <aside className="detail-modal" role="dialog" aria-modal="true">
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close">×</button>
              <span className="eyebrow">Complaint details</span>
              <h2>{selected.complaintId}</h2>
              <StatusBadge status={selected.status} />
              <dl>
                <dt>Student</dt><dd>{selected.studentName} ({selected.studentId})</dd>
                <dt>Department</dt><dd>{selected.department}</dd>
                <dt>Category</dt><dd>{selected.category}</dd>
                <dt>Submitted</dt><dd>{new Date(selected.createdAt).toLocaleString()}</dd>
                <dt>Last updated</dt><dd>{new Date(selected.updatedAt).toLocaleString()}</dd>
              </dl>
              <p className="detail-description">{selected.description}</p>
              <label>Update status
                <select value={selected.status} onChange={(event) => updateStatus(event.target.value)}>
                  <option>Pending</option><option>In Progress</option><option>Resolved</option>
                </select>
              </label>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}
