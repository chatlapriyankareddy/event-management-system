import { useEffect, useState } from "react";
import API from "./api";
import { UsersIcon, ShieldIcon, UserIcon, TrashIcon, SparklesIcon } from "./Icons";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Revoke account access for user "${name}"?`)) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const studentCount = users.filter((u) => u.role === "USER").length;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="badge-glow">ADMINISTRATION</span>
          <h2>Campus Community & Coordinators</h2>
          <p className="subtitle">Overview of registered attendees, event leaders, and access privileges</p>
        </div>
        <button onClick={fetchUsers} className="btn btn-ghost btn-sm">
          🔄 Sync Directory
        </button>
      </div>

      {/* Modern KPI Metric Cards */}
      <div className="kpi-metrics-row">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL COMMUNITY</span>
            <UsersIcon size={18} className="kpi-icon" />
          </div>
          <div className="kpi-value">{users.length}</div>
          <span className="kpi-sub">Verified event accounts</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">STUDENTS & ATTENDEES</span>
            <UserIcon size={18} className="kpi-icon accent-blue" />
          </div>
          <div className="kpi-value">{studentCount}</div>
          <span className="kpi-sub">Regular participants</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">ORGANIZERS & ADMINS</span>
            <ShieldIcon size={18} className="kpi-icon accent-purple" />
          </div>
          <div className="kpi-value">{adminCount}</div>
          <span className="kpi-sub">Event creation privileges</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-ring"></div>
          <p>Loading community directory...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state-card">
          <p>No community accounts found in database.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="sleek-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Contact</th>
                <th>Role Tier</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-table-avatar">{getInitials(u.name)}</div>
                  </td>
                  <td className="fw-semibold">
                    {u.name}
                    <div className="text-dim text-xs">UID: #{u.id}</div>
                  </td>
                  <td>{u.email}</td>
                  <td className="text-dim">{u.phone || "Not specified"}</td>
                  <td>
                    <span className={`badge-role-tier ${u.role === "ADMIN" ? "tier-admin" : "tier-user"}`}>
                      {u.role === "ADMIN" ? "ORGANIZER (ADMIN)" : "STUDENT (USER)"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="btn-action-icon danger"
                      title="Revoke Account"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserList;
