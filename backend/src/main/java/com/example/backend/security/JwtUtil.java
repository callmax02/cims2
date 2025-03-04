package com.example.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import org.springframework.beans.factory.annotation.Value;

import com.example.backend.model.Role;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
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
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour expiry
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract Email (used as subject)
    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email").toString());
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

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token); // This will throw an exception if the token is invalid
            return extractExpiration(token).after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}