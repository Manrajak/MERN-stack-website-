import React, { useState, useEffect } from "react";
import axios from "axios";
import './Form.css';
import { Link } from "react-router-dom";

const API_BASE = "https://mern-stack-website-2ku3.onrender.com";

function AddAgent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agents, setAgents] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch agents on mount
  useEffect(() => {
    axios.get(`${API_BASE}/agents`, { headers: { Authorization: token } })
      .then(res => setAgents(res.data.agents || []))
      .catch(() => setAgents([]));
  }, [success]); // refetch after adding

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(
        `${API_BASE}/agents`,
        { name, email, mobile, password },
        { headers: { Authorization: token } }
      );
      setSuccess("Agent added successfully!");
      setName(""); setEmail(""); setMobile(""); setPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add agent");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        await axios.delete(`${API_BASE}/agents/${id}`, { headers: { Authorization: token } });
        setAgents(agents.filter(agent => agent._id !== id));
      } catch {
        setError("Failed to delete agent");
      }
    }
  };

  return (
    <div className="container mt-5 form-container">
      <h2 className="mb-4">Add Agent</h2>
      <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile (+countrycode)</label>
          <input type="text" className="form-control" placeholder="+911234567890" value={mobile} onChange={e => setMobile(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Agent</button>
      </form>
    <p className="mt-3">
      <Link to="/upload-list" className="btn btn-outline-secondary btn-sm me-2">Go to Distribute CSV</Link>
      <Link to="/login" className="btn btn-outline-secondary btn-sm">Back to Login</Link>
    </p>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}

      <div className="mt-5">
        <h4>
          Available Agents {agents.length > 0 && <span className="badge bg-secondary">{agents.length}</span>}
        </h4>
        {agents.length === 0 ? (
          <div className="alert alert-info mt-2">No agents available. Please add one.</div>
        ) : (
          <ul className="list-group">
            {agents.map(agent => (
              <li key={agent._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>{agent.name}</strong> | {agent.email} | {agent.mobile}
                </span>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(agent._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddAgent;