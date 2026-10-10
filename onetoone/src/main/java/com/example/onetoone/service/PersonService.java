package com.example.onetoone.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.onetoone.entity.Person;
import com.example.onetoone.repository.PersonRepository;

@Service
public class PersonService {
      @Autowired
      private PersonRepository repo;

      public List<Person> getAll() {
            return repo.findAll();
      }

      public Person savePerson(Person person) {
            return repo.save(person);
      }
}
