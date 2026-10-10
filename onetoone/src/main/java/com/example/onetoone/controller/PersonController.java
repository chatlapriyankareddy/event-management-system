package com.example.onetoone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.onetoone.service.PersonService;
import com.example.onetoone.entity.Person;
import java.util.List;

@RestController
@RequestMapping("/person")
public class PersonController {
      @Autowired
      private PersonService service;

      @GetMapping
      public List<Person> getAll() {
            return service.getAll();
      }

      @PostMapping
      public Person savePerson(@RequestBody Person person) {
            return service.savePerson(person);
      }
}
