import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Campus support, simplified</span>
          <h1>Raise a complaint.<br /><em>Get it resolved.</em></h1>
          <p>A single transparent platform for students and campus administrators to report, track, and resolve campus issues.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/student/register">Create student account</Link>
            <Link className="btn btn-outline" to="/student/login">Sign in</Link>
          </div>
          <div className="hero-proof"><span>3</span> campus departments connected</div>
        </div>
      </section>
    </Layout>
  );
}
