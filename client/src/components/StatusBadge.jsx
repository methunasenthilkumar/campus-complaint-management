import React from "react";

export default function StatusBadge({ status }) {
  const className = status === "Resolved" ? "resolved" : status === "In Progress" ? "progress" : "pending";
  return <span className={`status-badge ${className}`}><span className="status-dot"></span>{status}</span>;
}
