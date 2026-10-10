package com.example.onetoone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.onetoone.entity.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

}
