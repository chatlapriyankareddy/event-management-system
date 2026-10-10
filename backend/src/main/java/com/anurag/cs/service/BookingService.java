package com.anurag.cs.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anurag.cs.dto.BookingDTO;
import com.anurag.cs.entity.Booking;
import com.anurag.cs.entity.Event;
import com.anurag.cs.repository.BookingRepository;
import com.anurag.cs.repository.EventRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking createBooking(BookingDTO dto) {
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + dto.getEventId()));

        int availableSeats = event.getTotalSeats() - event.getBookedSeats();
        if (dto.getNumberOfTickets() > availableSeats) {
            throw new RuntimeException("Insufficient seats available! Only " + availableSeats + " seats remaining.");
        }

        // Increment booked seats
        event.setBookedSeats(event.getBookedSeats() + dto.getNumberOfTickets());
        eventRepository.save(event);

        // Calculate total amount
        double price = event.getTicketPrice() != null ? event.getTicketPrice() : 0.0;
        double total = price * dto.getNumberOfTickets();

        Booking booking = new Booking();
        booking.setEventId(event.getId());
        booking.setEventTitle(event.getTitle());
        booking.setUserId(dto.getUserId());
        booking.setUserName(dto.getUserName());
        booking.setUserEmail(dto.getUserEmail());
        booking.setNumberOfTickets(dto.getNumberOfTickets());
        booking.setTotalAmount(total);
        booking.setBookingDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public String cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return "Booking not found";
        }

        if ("CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            // Restore booked seats in Event
            Event event = eventRepository.findById(booking.getEventId()).orElse(null);
            if (event != null) {
                int updated = Math.max(0, event.getBookedSeats() - booking.getNumberOfTickets());
                event.setBookedSeats(updated);
                eventRepository.save(event);
            }

            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
            return "Booking cancelled successfully";
        }

        return "Booking is already cancelled";
    }
}
