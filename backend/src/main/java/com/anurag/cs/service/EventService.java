package com.anurag.cs.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anurag.cs.dto.EventDTO;
import com.anurag.cs.entity.Event;
import com.anurag.cs.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public List<Event> searchEvents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return eventRepository.findAll();
        }
        return eventRepository.findByTitleContainingIgnoreCase(keyword.trim());
    }

    public List<Event> getEventsByCategory(String category) {
        if (category == null || category.equalsIgnoreCase("ALL")) {
            return eventRepository.findAll();
        }
        return eventRepository.findByCategoryIgnoreCase(category);
    }

    public Event createEvent(EventDTO dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setCategory(dto.getCategory());
        event.setEventDate(dto.getEventDate());
        event.setEventTime(dto.getEventTime());
        event.setVenue(dto.getVenue());
        event.setOrganizer(dto.getOrganizer());
        event.setTotalSeats(dto.getTotalSeats() != null ? dto.getTotalSeats() : 100);
        event.setBookedSeats(0);
        event.setTicketPrice(dto.getTicketPrice() != null ? dto.getTicketPrice() : 0.0);
        event.setStatus(dto.getStatus() != null ? dto.getStatus() : "UPCOMING");
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, EventDTO dto) {
        Event existing = eventRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }

        if (dto.getTitle() != null) existing.setTitle(dto.getTitle());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        if (dto.getCategory() != null) existing.setCategory(dto.getCategory());
        if (dto.getEventDate() != null) existing.setEventDate(dto.getEventDate());
        if (dto.getEventTime() != null) existing.setEventTime(dto.getEventTime());
        if (dto.getVenue() != null) existing.setVenue(dto.getVenue());
        if (dto.getOrganizer() != null) existing.setOrganizer(dto.getOrganizer());
        if (dto.getTotalSeats() != null) existing.setTotalSeats(dto.getTotalSeats());
        if (dto.getTicketPrice() != null) existing.setTicketPrice(dto.getTicketPrice());
        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());

        return eventRepository.save(existing);
    }

    public String deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return "Event deleted successfully";
        }
        return "Event not found";
    }
}
