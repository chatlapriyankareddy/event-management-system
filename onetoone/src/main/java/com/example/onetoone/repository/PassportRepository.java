package com.example.onetoone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.onetoone.entity.Passport;

@Repository
public interface PassportRepository extends JpaRepository<Passport, Long> {

}
