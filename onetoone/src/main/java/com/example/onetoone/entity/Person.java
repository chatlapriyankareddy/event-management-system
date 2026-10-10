package com.example.onetoone.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class Person {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String name;
      private int age;
      @OneToOne(cascade = CascadeType.ALL)
      @JoinColumn(name = "passport_id")
      private Passport passport;

      public Person() {
            // CSonetoone
      }

      public Long getId() {
            return id;
      }

      public String getName() {
            return name;
      }

      public int getAge() {
            return age;
      }

      public void setId(Long id) {
            this.id = id;
      }

      public void setName(String name) {
            this.name = name;
      }

      public void setAge(int age) {
            this.age = age;
      }

      public Passport getPassport() {
            return passport;
      }

      public void setPassport(Passport passport) {
            this.passport = passport;
      }

}
