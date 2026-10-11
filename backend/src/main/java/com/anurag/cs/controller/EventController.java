package com.anurag.cs.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.anurag.cs.dto.EventDTO;
import com.anurag.cs.entity.Event;
import com.anurag.cs.service.EventService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/events", "/api/events"})
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public List<Event> getAllEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return eventService.searchEvents(search);
        }
        if (category != null && !category.equalsIgnoreCase("ALL")) {
            return eventService.getEventsByCategory(category);
        }
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(event);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@Valid @RequestBody EventDTO dto) {
        Event created = eventService.createEvent(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody EventDTO dto) {
        Event updated = eventService.updateEvent(id, dto);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        String result = eventService.deleteEvent(id);
        return ResponseEntity.ok(result);
    }
}
