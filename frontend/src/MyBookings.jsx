import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";
import {
  TicketIcon,
  CalendarIcon,
  QrCodeIcon,
  SparklesIcon,
  CheckCircleIcon,
  TrashIcon,
} from "./Icons";

function MyBookings({ currentUser }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("passes"); // "passes" or "table"
  const [viewAll, setViewAll] = useState(!currentUser || currentUser.role === "ADMIN");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let res;
      if (currentUser && !viewAll) {
        res = await API.get(`/bookings/user/${currentUser.id}`);
      } else {
        res = await API.get("/bookings");
      }
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load passes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser, viewAll]);

  const handleCancelPass = async (id, title) => {
    if (window.confirm(`Cancel Pass #${id} for "${title}"? This releases your reserved seats.`)) {
      try {
        await API.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        alert("Failed to cancel pass.");
      }
    }
  };

  return (
    <div className="page-container">
      {/* Header and Controls */}
      <div className="page-header">
        <div>
          <span className="badge-glow">EVENT WALLET</span>
          <h2>My Event Passes & Reservations</h2>
          <p className="subtitle">
            {currentUser
              ? `Digital passes registered under ${currentUser.name}`
              : "All active event reservations across the community"}
          </p>
        </div>

        <div className="header-actions-cluster">
          {currentUser && (
            <button
              onClick={() => setViewAll(!viewAll)}
              className="btn btn-ghost btn-sm"
            >
              {viewAll ? "My Passes Only" : "All System Passes"}
            </button>
          )}

          <div className="view-toggle-pill">
            <button
              onClick={() => setViewMode("passes")}
              className={`toggle-btn ${viewMode === "passes" ? "active" : ""}`}
            >
              🎟️ Pass View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
            >
              📋 Table View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-ring"></div>
          <p>Loading digital ticket passes...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-box">
            <TicketIcon size={32} />
          </div>
          <h3>No event passes reserved yet</h3>
          <p>Browse our catalog of campus events and book your first digital pass.</p>
          <Link to="/" className="btn btn-glow-primary">
            Explore Events
          </Link>
        </div>
      ) : viewMode === "passes" ? (
        /* Digital Event Passes Grid */
        <div className="passes-grid">
          {bookings.map((b) => (
            <div key={b.id} className="pass-voucher-card">
              {/* Ticket Left Section */}
              <div className="pass-main-section">
                <div className="pass-top-meta">
                  <span className="pass-brand-tag">PULSE PASS</span>
                  <span className="pass-number">VOUCHER #{b.id}</span>
                </div>

                <h3 className="pass-event-title">{b.eventTitle}</h3>

                <div className="pass-meta-grid">
                  <div>
                    <label>ATTENDEE</label>
                    <p>{b.userName}</p>
                  </div>
                  <div>
                    <label>EMAIL</label>
                    <p className="truncate-text">{b.userEmail}</p>
                  </div>
                  <div>
                    <label>SEATS</label>
                    <p>{b.numberOfTickets} Pass(es)</p>
                  </div>
                  <div>
                    <label>AMOUNT</label>
                    <p>₹{(b.totalAmount || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="pass-footer-meta">
                  <span>📅 Booked on {b.bookingDate}</span>
                  <span className={`status-pill ${b.status === "CONFIRMED" ? "status-confirmed" : "status-cancelled"}`}>
                    {b.status}
                  </span>
                </div>
              </div>

              {/* Perforated Stub Section */}
              <div className="pass-stub-section">
                <div className="stub-notch top"></div>
                <div className="stub-divider"></div>
                <div className="stub-notch bottom"></div>

                <QrCodeIcon size={34} className="stub-qr" />
                <span className="stub-code">PASS-{b.id}</span>

                {b.status === "CONFIRMED" ? (
                  <button
                    onClick={() => handleCancelPass(b.id, b.eventTitle)}
                    className="btn-stub-cancel"
                    title="Cancel Reservation"
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="stub-cancelled-tag">Void</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Modern Table View */
        <div className="table-responsive">
          <table className="sleek-table">
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Event Title</th>
                <th>Attendee</th>
                <th>Email</th>
                <th>Passes</th>
                <th>Total Paid</th>
                <th>Booked At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span className="mono-badge">#{b.id}</span>
                  </td>
                  <td className="fw-semibold">{b.eventTitle}</td>
                  <td>{b.userName}</td>
                  <td className="text-dim">{b.userEmail}</td>
                  <td>{b.numberOfTickets}</td>
                  <td>₹{(b.totalAmount || 0).toFixed(2)}</td>
                  <td className="text-dim">{b.bookingDate}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        b.status === "CONFIRMED" ? "status-confirmed" : "status-cancelled"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === "CONFIRMED" ? (
                      <button
                        onClick={() => handleCancelPass(b.id, b.eventTitle)}
                        className="btn btn-ghost danger btn-sm"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-dim">Cancelled</span>
                    )}
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

export default MyBookings;
