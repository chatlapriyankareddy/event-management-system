import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "./api";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  TicketIcon,
} from "./Icons";

function EventForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Technical",
    description: "",
    eventDate: "",
    eventTime: "10:00 AM",
    venue: "",
    organizer: "",
    totalSeats: 100,
    ticketPrice: 0.0,
    status: "UPCOMING",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      API.get(`/events/${id}`)
        .then((res) => {
          setFormData(res.data);
        })
        .catch(() => {
          alert("Failed to load event data.");
          navigate("/");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setCategory = (cat) => {
    setFormData((prev) => ({ ...prev, category: cat }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        await API.put(`/events/${id}`, formData);
      } else {
        await API.post("/events", formData);
      }
      navigate("/");
    } catch (err) {
      alert("Error saving event. Please verify required fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = [
    { id: "Technical", label: "Technical", icon: "💻" },
    { id: "Cultural", label: "Cultural", icon: "🎭" },
    { id: "Workshop", label: "Workshop", icon: "🛠️" },
    { id: "Sports", label: "Sports", icon: "🏆" },
    { id: "Seminar", label: "Seminar", icon: "🎙️" },
  ];

  if (loading) {
    return (
      <div className="page-container loading-state">
        <div className="spinner-ring"></div>
        <p>Loading event editor...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-page-layout">
        {/* Form Inputs (Left) */}
        <div className="editor-card">
          <div className="editor-header">
            <span className="badge-glow">EVENT BUILDER</span>
            <h2>{isEditing ? "Modify Event Details" : "Publish Campus Event"}</h2>
            <p className="subtitle">
              {isEditing ? "Update schedule, tickets, and location" : "Create an event pass that students can discover and book"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="editor-form">
            <div className="form-field">
              <label className="input-label">Event Headline Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. HackSprint 2026: Code for the Future"
                value={formData.title}
                onChange={handleChange}
                className="sleek-input"
              />
            </div>

            {/* Category Selector Tiles */}
            <div className="form-field">
              <label className="input-label">Select Event Domain *</label>
              <div className="category-tile-grid">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCategory(opt.id)}
                    className={`category-tile ${formData.category === opt.id ? "selected" : ""}`}
                  >
                    <span className="tile-icon">{opt.icon}</span>
                    <span className="tile-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label className="input-label">Event Summary & Agenda</label>
              <textarea
                name="description"
                rows="3"
                placeholder="What will attendees experience, learn, or build during this session?"
                value={formData.description || ""}
                onChange={handleChange}
                className="sleek-input"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-field col">
                <label className="input-label">Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  value={formData.eventDate || ""}
                  onChange={handleChange}
                  className="sleek-input"
                />
              </div>

              <div className="form-field col">
                <label className="input-label">Event Time *</label>
                <input
                  type="text"
                  name="eventTime"
                  required
                  placeholder="e.g. 10:00 AM - 04:00 PM"
                  value={formData.eventTime}
                  onChange={handleChange}
                  className="sleek-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field col">
                <label className="input-label">Venue & Hall *</label>
                <input
                  type="text"
                  name="venue"
                  required
                  placeholder="e.g. Main Auditorium / CS Lab 4"
                  value={formData.venue}
                  onChange={handleChange}
                  className="sleek-input"
                />
              </div>

              <div className="form-field col">
                <label className="input-label">Host Organization / Club</label>
                <input
                  type="text"
                  name="organizer"
                  placeholder="e.g. ACM Student Chapter"
                  value={formData.organizer || ""}
                  onChange={handleChange}
                  className="sleek-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field col">
                <label className="input-label">Total Seats Capacity *</label>
                <input
                  type="number"
                  name="totalSeats"
                  required
                  min="1"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  className="sleek-input"
                />
              </div>

              <div className="form-field col">
                <label className="input-label">Pass Price (₹) (0 for Free)</label>
                <input
                  type="number"
                  name="ticketPrice"
                  step="0.01"
                  min="0"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  className="sleek-input"
                />
              </div>
            </div>

            <div className="editor-actions">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-glow-primary"
              >
                {submitting ? "Publishing..." : isEditing ? "Save Modifications" : "🚀 Launch Event"}
              </button>
              <Link to="/" className="btn btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Live Real-Time Card Preview (Right) */}
        <aside className="preview-pane">
          <div className="preview-sticky-wrap">
            <div className="preview-label">
              <SparklesIcon size={14} />
              <span>LIVE CARD PREVIEW</span>
            </div>

            <div className="event-card preview-card">
              <div className="card-top-row">
                <span className={`category-tag tag-${formData.category?.toLowerCase() || "default"}`}>
                  {formData.category || "Domain"}
                </span>
                <span className={`price-badge ${formData.ticketPrice > 0 ? "paid" : "free"}`}>
                  {formData.ticketPrice > 0 ? `₹${parseFloat(formData.ticketPrice).toFixed(2)}` : "FREE ENTRY"}
                </span>
              </div>

              <h3 className="card-event-title">{formData.title || "Your Event Headline Here"}</h3>
              <p className="card-event-desc">
                {formData.description || "The description summary will display here to attract students and participants."}
              </p>

              <div className="card-meta-list">
                <div className="meta-item">
                  <CalendarIcon size={14} className="meta-icon" />
                  <span>{formData.eventDate || "YYYY-MM-DD"}</span>
                </div>
                <div className="meta-item">
                  <ClockIcon size={14} className="meta-icon" />
                  <span>{formData.eventTime || "10:00 AM"}</span>
                </div>
                <div className="meta-item">
                  <MapPinIcon size={14} className="meta-icon" />
                  <span>{formData.venue || "Campus Venue"}</span>
                </div>
              </div>

              <div className="capacity-section">
                <div className="capacity-labels">
                  <span className="capacity-text">
                    <strong>0</strong> of {formData.totalSeats || 100} booked
                  </span>
                  <span className="availability-text available">
                    {formData.totalSeats || 100} seats left
                  </span>
                </div>
                <div className="capacity-progress-bar">
                  <div className="progress-fill fill-primary" style={{ width: "5%" }}></div>
                </div>
              </div>

              <div className="card-actions-row">
                <button type="button" className="btn btn-glow-primary btn-book" disabled>
                  <TicketIcon size={15} />
                  <span>Book Pass</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EventForm;
