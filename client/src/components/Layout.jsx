import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../services/api";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = getSession();
  const logout = () => {
    clearSession();
    navigate("/");
  };
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand"><span className="brand-mark">SC</span><span>Smart Campus</span></Link>
        {user ? (
          <div className="topbar-user">
            <span>{user.name}</span>
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          </div>
        ) : (
          <nav className="topnav">
            <Link to="/student/login">Student Login</Link>
            <Link to="/admin/login" className="btn btn-light">Admin</Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
