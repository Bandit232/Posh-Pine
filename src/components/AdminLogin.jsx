import React, { useState } from "react";

export default function AdminLogin({ onLogin, onCancel, error, loading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="admin-login section">
      <div className="container" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="section-head">
          <h2>Admin Login</h2>
          <p>Sign in with your admin username and password.</p>
        </div>

        <div className="form-grid" style={{ display: "grid", gap: 16, marginTop: 16 }}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </label>
        </div>

        {error ? (
          <div style={{ color: "red", marginTop: 16 }}>{error}</div>
        ) : null}

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button className="btn" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => onLogin({ username, password })}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>
    </section>
  );
}
