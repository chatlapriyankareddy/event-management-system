import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./api";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  SearchIcon,
  SparklesIcon,
  TrashIcon,
  EditIcon,
  QrCodeIcon,
  CheckCircleIcon,
} from "./Icons";

function EventList({ currentUser }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Booking Modal State
  const [bookingEvent, setBookingEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Digital Ticket Success Voucher Modal
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== "ALL") {
        params.category = selectedCategory;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const res = await API.get("/events", { params });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSearchTerm("");
  };

  const handleDeleteEvent = async (id, title) => {
    if (window.confirm(`Delete event "${title}"? This action cannot be undone.`)) {
      try {
        await API.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert("Failed to delete event.");
      }
    }
  };

  const openBookingModal = (event) => {
    setBookingEvent(event);
    setTicketCount(1);
    setAttendeeName(currentUser ? currentUser.name : "");
    setAttendeeEmail(currentUser ? currentUser.email : "");
  };

  const closeBookingModal = () => {
    setBookingEvent(null);
  };

  const handleTicketStep = (delta) => {
    if (!bookingEvent) return;
    const maxAvailable = bookingEvent.totalSeats - bookingEvent.bookedSeats;
    setTicketCount((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxAvailable) return maxAvailable;
      return next;
    });
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!attendeeName.trim() || !attendeeEmail.trim()) {
      alert("Please provide attendee name and email.");
      return;
    }

    const available = bookingEvent.totalSeats - bookingEvent.bookedSeats;
    if (ticketCount > available) {
      alert(`Only ${available} tickets available!`);
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        eventId: bookingEvent.id,
        userId: currentUser ? currentUser.id : null,
        userName: attendeeName.trim(),
        userEmail: attendeeEmail.trim(),
        numberOfTickets: parseInt(ticketCount, 10),
      };

      const res = await API.post("/bookings", payload);
      closeBookingModal();
      fetchEvents();

      // Show digital ticket pass voucher modal
      setConfirmedBooking({
        ...res.data,
        event: bookingEvent,
      });
    } catch (err) {
      const msg = err.response?.data || "Reservation failed. Please try again.";
      alert(typeof msg === "string" ? msg : "Reservation failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  const categories = [
    { id: "ALL", label: "All Events", icon: "✨" },
    { id: "Technical", label: "Technical", icon: "💻" },
    { id: "Cultural", label: "Cultural", icon: "🎭" },
    { id: "Workshop", label: "Workshops", icon: "🛠️" },
    { id: "Sports", label: "Sports", icon: "🏆" },
    { id: "Seminar", label: "Seminars", icon: "🎙️" },
  ];

  return (
    <div className="page-container">
      {/* Sleek Hero Banner */}
      <section className="hero-section">
        <div className="hero-badge">
          <SparklesIcon size={14} />
          <span>Next-Gen Campus Experience</span>
        </div>
        <h1 className="hero-title">
          Discover & Attend <span className="text-gradient">Extraordinary Events</span>
        </h1>
        <p className="hero-desc">
          Your portal for hackathons, cultural fests, hands-on workshops, and championship sports. Reserve your pass in seconds.
        </p>

        <div className="hero-stats-row">
          <div className="hero-stat-pill">
            <span className="stat-glow-dot"></span>
            <strong>{events.length} Active Events</strong>
          </div>
          <div className="hero-stat-pill">
            <TicketIcon size={14} />
            <span>Instant Digital Passes</span>
          </div>
          <div className="hero-stat-pill">
            <CheckCircleIcon size={14} />
            <span>Real-time Live Inventory</span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="filter-panel">
        {/* Category Pills */}
        <div className="category-scroll-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-pill ${selectedCategory === cat.id ? "active" : ""}`}
            >
              <span className="category-emoji">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar & Reset */}
        <form onSubmit={handleSearchSubmit} className="search-bar-form">
          <div className="search-input-wrapper">
            <SearchIcon size={16} className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search by event title, topic or tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="btn btn-glow-primary">
            Search
          </button>
          {(searchTerm || selectedCategory !== "ALL") && (
            <button type="button" onClick={handleResetFilters} className="btn btn-ghost">
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner-ring"></div>
          <p>Syncing live event listings...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-box">
            <CalendarIcon size={32} />
          </div>
          <h3>No matching events found</h3>
          <p>Try searching for a different keyword or create an event for your club.</p>
          <Link to="/add-event" className="btn btn-glow-primary">
            + Host New Event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const availableSeats = event.totalSeats - event.bookedSeats;
            const isFull = availableSeats <= 0;
            const percentBooked = Math.min(
              100,
              Math.round((event.bookedSeats / (event.totalSeats || 1)) * 100)
            );

            return (
              <article key={event.id} className="event-card">
                {/* Card Top: Category and Price */}
                <div className="card-top-row">
                  <span className={`category-tag tag-${event.category?.toLowerCase() || "default"}`}>
                    {event.category}
                  </span>
                  <span className={`price-badge ${event.ticketPrice > 0 ? "paid" : "free"}`}>
                    {event.ticketPrice > 0 ? `₹${event.ticketPrice.toFixed(2)}` : "FREE ENTRY"}
                  </span>
                </div>

                {/* Event Title & Description */}
                <h3 className="card-event-title">{event.title}</h3>
                <p className="card-event-desc">{event.description}</p>

                {/* Event Schedule & Location */}
                <div className="card-meta-list">
                  <div className="meta-item">
                    <CalendarIcon size={14} className="meta-icon" />
                    <span>{event.eventDate}</span>
                  </div>
                  <div className="meta-item">
                    <ClockIcon size={14} className="meta-icon" />
                    <span>{event.eventTime}</span>
                  </div>
                  <div className="meta-item">
                    <MapPinIcon size={14} className="meta-icon" />
                    <span className="truncate-text">{event.venue}</span>
                  </div>
                </div>

                {/* Capacity & Progress Bar */}
                <div className="capacity-section">
                  <div className="capacity-labels">
                    <span className="capacity-text">
                      <strong>{event.bookedSeats}</strong> of {event.totalSeats} booked
                    </span>
                    <span className={`availability-text ${isFull ? "sold-out" : "available"}`}>
                      {isFull ? "Housefull" : `${availableSeats} seats left`}
                    </span>
                  </div>
                  <div className="capacity-progress-bar">
                    <div
                      className={`progress-fill ${isFull ? "fill-danger" : percentBooked > 75 ? "fill-warning" : "fill-primary"}`}
                      style={{ width: `${percentBooked}%` }}
                    ></div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="card-actions-row">
                  <button
                    onClick={() => openBookingModal(event)}
                    disabled={isFull}
                    className={`btn btn-book ${isFull ? "btn-disabled" : "btn-glow-primary"}`}
                  >
                    <TicketIcon size={15} />
                    <span>{isFull ? "Sold Out" : "Book Pass"}</span>
                  </button>

                  <div className="admin-quick-actions">
                    <button
                      onClick={() => navigate(`/edit-event/${event.id}`)}
                      className="btn-action-icon"
                      title="Edit Event"
                    >
                      <EditIcon size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id, event.title)}
                      className="btn-action-icon danger"
                      title="Delete Event"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Reservation Drawer / Modal */}
      {bookingEvent && (
        <div className="modal-overlay">
          <div className="modal-glass-card">
            <div className="modal-card-header">
              <div>
                <span className="modal-pretitle">Reserve Your Pass</span>
                <h3 className="modal-title">{bookingEvent.title}</h3>
              </div>
              <button onClick={closeBookingModal} className="btn-modal-close">
                &times;
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="modal-booking-form">
              <div className="modal-event-summary">
                <div className="summary-row">
                  <span>Category:</span>
                  <strong>{bookingEvent.category}</strong>
                </div>
                <div className="summary-row">
                  <span>Schedule:</span>
                  <strong>{bookingEvent.eventDate} at {bookingEvent.eventTime}</strong>
                </div>
                <div className="summary-row">
                  <span>Venue:</span>
                  <strong>{bookingEvent.venue}</strong>
                </div>
                <div className="summary-row">
                  <span>Unit Price:</span>
                  <strong className="text-glow-accent">
                    {bookingEvent.ticketPrice > 0 ? `₹${bookingEvent.ticketPrice}` : "Free"}
                  </strong>
                </div>
              </div>

              {/* Stepper for Ticket Count */}
              <div className="ticket-stepper-box">
                <label className="input-label">Select Quantity of Passes:</label>
                <div className="stepper-controls">
                  <button
                    type="button"
                    onClick={() => handleTicketStep(-1)}
                    disabled={ticketCount <= 1}
                    className="btn-step"
                  >
                    -
                  </button>
                  <span className="step-display-value">{ticketCount}</span>
                  <button
                    type="button"
                    onClick={() => handleTicketStep(1)}
                    disabled={ticketCount >= bookingEvent.totalSeats - bookingEvent.bookedSeats}
                    className="btn-step"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="form-field">
                <label className="input-label">Attendee Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="sleek-input"
                />
              </div>

              <div className="form-field">
                <label className="input-label">Attendee Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aryan@university.edu"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="sleek-input"
                />
              </div>

              {/* Price Calculation Pill */}
              <div className="cost-breakdown-card">
                <div className="cost-line">
                  <span>{ticketCount} x Pass ({bookingEvent.ticketPrice > 0 ? `₹${bookingEvent.ticketPrice}` : "Free"})</span>
                  <strong>₹{((bookingEvent.ticketPrice || 0) * ticketCount).toFixed(2)}</strong>
                </div>
                <div className="cost-total-row">
                  <span>Total Payable:</span>
                  <span className="total-amount-glow">
                    ₹{((bookingEvent.ticketPrice || 0) * ticketCount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="modal-actions-row">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn btn-glow-primary btn-block"
                >
                  {bookingLoading ? "Confirming..." : "Confirm Pass Reservation"}
                </button>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Event Pass Voucher Modal (Upon Booking Success) */}
      {confirmedBooking && (
        <div className="modal-overlay">
          <div className="modal-glass-card ticket-pass-modal">
            <div className="ticket-voucher-badge">
              <SparklesIcon size={16} />
              <span>PASS CONFIRMED</span>
            </div>

            <h2 className="voucher-success-title">Your Event Pass is Ready!</h2>
            <p className="voucher-success-sub">Show this digital voucher at the event check-in gate.</p>

            <div className="digital-ticket-card">
              <div className="ticket-card-header">
                <span className="ticket-card-brand">PULSE PASS</span>
                <span className="ticket-card-id">#{confirmedBooking.id}</span>
              </div>

              <h3 className="ticket-event-name">{confirmedBooking.eventTitle}</h3>

              <div className="ticket-details-grid">
                <div>
                  <label>ATTENDEE</label>
                  <p>{confirmedBooking.userName}</p>
                </div>
                <div>
                  <label>PASS QUANTITY</label>
                  <p>{confirmedBooking.numberOfTickets} Ticket(s)</p>
                </div>
                <div>
                  <label>TOTAL PAID</label>
                  <p>₹{(confirmedBooking.totalAmount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <label>STATUS</label>
                  <p className="text-glow-accent">{confirmedBooking.status}</p>
                </div>
              </div>

              <div className="ticket-barcode-strip">
                <QrCodeIcon size={36} className="barcode-qr" />
                <div className="barcode-lines">
                  <span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>

            <div className="voucher-modal-actions">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="btn btn-glow-primary btn-block"
              >
                Close & View Passes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventList;
