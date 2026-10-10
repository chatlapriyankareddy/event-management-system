import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import EventList from "./EventList";
import EventForm from "./EventForm";
import MyBookings from "./MyBookings";
import UserList from "./UserList";
import Login from "./Login";
import Register from "./Register";
import { SparklesIcon } from "./Icons";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<EventList currentUser={currentUser} />} />
            <Route path="/add-event" element={<EventForm />} />
            <Route path="/edit-event/:id" element={<EventForm />} />
            <Route path="/my-bookings" element={<MyBookings currentUser={currentUser} />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <footer className="footer-bar">
          <div className="footer-content">
            <div className="footer-brand-line">
              <span className="footer-glow-cube"></span>
              <strong>PULSE EVENTS</strong> — Campus Intelligence & Ticketing
            </div>
            <p className="footer-tech-stack">
              Engineered with Spring Boot 4/3, Java 21, Hibernate JPA, Spring Security (JWT) & React 19.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;