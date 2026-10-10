package com.anurag.cs.config;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.anurag.cs.entity.Booking;
import com.anurag.cs.entity.Event;
import com.anurag.cs.entity.User;
import com.anurag.cs.enums.Role;
import com.anurag.cs.repository.BookingRepository;
import com.anurag.cs.repository.EventRepository;
import com.anurag.cs.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Users if table is empty
        if (userRepository.count() == 0) {
            User admin = new User(
                null,
                "Admin User",
                "admin@event.com",
                passwordEncoder.encode("admin123"),
                "9876543210",
                Role.ADMIN
            );
            userRepository.save(admin);

            User student = new User(
                null,
                "Rahul Sharma",
                "student@event.com",
                passwordEncoder.encode("student123"),
                "9123456789",
                Role.USER
            );
            userRepository.save(student);

            System.out.println(">>> Sample Users Seeded: admin@event.com, student@event.com");
        }

        // Seed Events if table is empty
        if (eventRepository.count() == 0) {
            Event event1 = new Event(
                null,
                "TechPulse 2026 - National Hackathon",
                "24-Hour inter-college coding marathon tackling real-world problem statements across Web3, AI, and Sustainable Tech.",
                "Technical",
                "2026-11-20",
                "09:00 AM",
                "Auditorium Hall A & Lab 3",
                "Computer Science Department",
                120,
                30,
                150.0,
                "UPCOMING"
            );

            Event event2 = new Event(
                null,
                "Spandan 2026 - Annual Cultural Fest",
                "The biggest annual college carnival featuring music bands, western & classical dance, drama, and celebrity night.",
                "Cultural",
                "2026-11-25",
                "05:00 PM",
                "Open Air Amphitheatre",
                "Student Cultural Committee",
                500,
                120,
                0.0,
                "UPCOMING"
            );

            Event event3 = new Event(
                null,
                "Workshop: Full-Stack Web with Spring Boot & React",
                "Hands-on masterclass covering REST APIs, JWT authentication, MySQL, and modern React with Vite.",
                "Workshop",
                "2026-12-02",
                "10:30 AM",
                "Seminar Hall 2",
                "IEEE Student Branch",
                60,
                45,
                200.0,
                "UPCOMING"
            );

            Event event4 = new Event(
                null,
                "Inter-College Cricket League",
                "3-day thrilling cricket tournament with top 16 college teams competing for the annual championship trophy.",
                "Sports",
                "2026-12-10",
                "08:00 AM",
                "University Sports Complex",
                "Sports Council",
                300,
                80,
                50.0,
                "UPCOMING"
            );

            Event event5 = new Event(
                null,
                "Seminar: AI in Modern Software Engineering",
                "Special talk by senior industry leaders on how Generative AI, cloud architectures, and DevOps are shaping tech careers.",
                "Seminar",
                "2026-12-15",
                "02:00 PM",
                "Conference Hall B",
                "Training & Placement Cell",
                150,
                60,
                0.0,
                "UPCOMING"
            );

            eventRepository.save(event1);
            eventRepository.save(event2);
            eventRepository.save(event3);
            eventRepository.save(event4);
            eventRepository.save(event5);

            System.out.println(">>> Sample Events Seeded successfully.");

            // Seed a sample booking for Rahul Sharma
            User rahul = userRepository.findByEmail("student@event.com");
            if (rahul != null && bookingRepository.count() == 0) {
                Booking sampleBooking = new Booking(
                    null,
                    event1.getId(),
                    event1.getTitle(),
                    rahul.getId(),
                    rahul.getName(),
                    rahul.getEmail(),
                    2,
                    300.0,
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                    "CONFIRMED"
                );
                bookingRepository.save(sampleBooking);
                System.out.println(">>> Sample Booking Seeded for Rahul Sharma.");
            }
        }
    }
}
