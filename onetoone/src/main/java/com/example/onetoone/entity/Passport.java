package com.example.onetoone.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Passport {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String passportNumber;
      private String country;

      public Passport() {

      }

      public Long getId() {
            return id;
      }

      public String getPassportNumber() {
            return passportNumber;
      }

      public String getCountry() {
            return country;
      }

      public void setId(Long id) {
            this.id = id;
      }

      public void setPassportNumber(String passportNumber) {
            this.passportNumber = passportNumber;
      }

      public void setCountry(String country) {
            this.country = country;
      }

}
