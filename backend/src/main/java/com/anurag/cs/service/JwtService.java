package com.anurag.cs.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
      private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

      private final SecretKey secretKey;

      public JwtService(@Value("${app.jwt.secret}") String secretKey) {
            if (secretKey == null || secretKey.isBlank()) {
                  this.secretKey = Jwts.SIG.HS256.key().build();
                  logger.warn("JWT_SECRET is not configured; generated a temporary signing key. "
                              + "Existing tokens will be invalid after the service restarts.");
            } else {
                  this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            }
      }

      public String generateToken(String email) {
            return Jwts.builder()
                        .subject(email)
                        .issuedAt(new Date())
                        .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24)) // 24 hours
                        .signWith(secretKey)
                        .compact();
      }

      public String extractUsername(String token) {
            return Jwts.parser()
                        .verifyWith(secretKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getSubject();// extract your email
      }

      public boolean validateToken(String token) {
            try {
                  Jwts.parser()
                              .verifyWith(secretKey)
                              .build()
                              .parseSignedClaims(token);
                  return true;
            } catch (Exception e) {
                  return false;
            }
      }
}
