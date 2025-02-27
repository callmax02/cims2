package com.example.backend.config;

import com.example.backend.model.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "supersecretkeythatneedstobe32charslong!";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Generate JWT with ID, Name, Email, and Role
    public String generateToken(Long id, String name, String email, Role role) {
        return Jwts.builder()
                .setClaims(Map.of(
                        "id", id,
                        "name", name,
                        "email", email,
                        "role", role.name()
                ))
                .setSubject(email)  // Subject remains email for easy retrieval
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour expiry
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract Email (used as subject)
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract ID
    public Long extractId(String token) {
        return Long.valueOf(extractClaim(token, claims -> claims.get("id").toString()));
    }

    // Extract Name
    public String extractName(String token) {
        return extractClaim(token, claims -> claims.get("name").toString());
    }

    // Extract Role
    public Role extractRole(String token) {
        return Role.valueOf(extractClaim(token, claims -> claims.get("role").toString()));
    }

    // Generic method to extract any claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}
