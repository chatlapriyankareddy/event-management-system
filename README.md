# 🎓 Campus Event Management System (Full-Stack Academic Project)

A complete, full-stack **Event Management System** developed with **Spring Boot (Java 21)** and **React 19 (Vite)**. Built following authentic college project standards with simple, responsive, and functional UI.

---

## 🚀 Quick Start Guide

### 1. Backend (`backend/`)
The backend is built with Spring Boot, Spring Security (JWT), and JPA..

```bash
cd backend

# Run backend (Starts immediately with pre-seeded sample data on port 8082):
.\mvnw.cmd spring-boot:run
```
* **Port**: Runs on `http://localhost:8082` (avoids Windows port 8080 conflicts).
* **Database**: Uses in-memory H2 by default (zero setup). For a persistent database, set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.
* **Pre-seeded Sample Data**: On startup, sample users, events, and registrations are automatically seeded!

---

### 2. Frontend (`frontend/`)
The frontend is built with React 19, Vite, and React Router.

```bash
cd frontend
npm install
npm run dev
```
* **URL**: `http://localhost:5173` or `http://localhost:5174`
* **API URL**: Copy `frontend/.env.example` to `.env` and set `VITE_API_BASE_URL` when the backend is not running at `http://localhost:8082`.

---

## Production Deployment

* **Frontend**: https://event-management-system-smoky-xi.vercel.app/
* **Backend API**: https://event-management-system-production-45a7.up.railway.app/
* **Railway service root**: `/backend`

Railway supplies `PORT` automatically. Set `JWT_SECRET` to a stable value of at least 32 bytes so login tokens remain valid after a restart, and set `CORS_ALLOWED_ORIGINS` when adding another frontend origin. The default H2 database is ephemeral; attach a managed database and supply the datasource variables above when data must survive a redeploy.

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin / Organizer** | `admin@event.com` | `admin123` | Create, Edit, Delete events, view all bookings & registered users |
| **Student / Attendee** | `student@event.com` | `student123` | Browse events, book tickets, cancel personal registrations |

*(You can also register a new account anytime from the `/register` page or use the 1-click Quick-Fill buttons on the Login page).*

---

## 📋 Features

1. **User Authentication & Roles**:
   * JWT-based stateless authentication (`jjwt 0.12.6`).
   * BCrypt password encryption.
   * Role-based access (`ADMIN` vs `USER`).
2. **Event Management (CRUD)**:
   * Browse events with category filters (`Technical`, `Cultural`, `Workshop`, `Sports`, `Seminar`).
   * Live search by event title.
   * Create new event (`/add-event`) with venue, date, time, capacity, and ticket price.
   * Edit existing events (`/edit-event/:id`).
   * Delete events with confirmation.
3. **Ticket Booking Engine**:
   * Interactive booking modal with ticket quantity selection.
   * Automatic seat availability tracking (`bookedSeats / totalSeats`).
   * Total price calculation.
   * Prevents booking when seats are full ("Housefull").
4. **Attendee Dashboard & Bookings**:
   * View registrations (`/my-bookings`) in classic bordered table layout.
   * Cancel bookings with real-time seat recovery.
5. **Admin User & System Overview**:
   * View all registered system attendees and administrators (`/users`).
   * User statistics cards (Total Users, Students, Admins).

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new student or admin |
| `POST` | `/api/auth/login` | Login and obtain JWT token |
| `GET` | `/events` | List all events (supports `?category=` & `?search=`) |
| `GET` | `/events/{id}` | Get event details by ID |
| `POST` | `/events` | Create a new event |
| `PUT` | `/events/{id}` | Update an existing event |
| `DELETE` | `/events/{id}` | Delete an event |
| `GET` | `/bookings` | List all bookings |
| `GET` | `/bookings/user/{userId}` | List bookings for a specific user |
| `POST` | `/bookings` | Book tickets for an event |
| `DELETE` | `/bookings/{id}` | Cancel a booking and release seats |
| `GET` | `/users` | List all registered users |
| `DELETE` | `/users/{id}` | Delete a user |
