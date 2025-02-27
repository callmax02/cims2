package com.example.backend.service;

import com.example.backend.config.JwtUtil;
import com.example.backend.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtUtil jwtUtil;

    // Generate JWT token
    public String generateToken(Long id, String name, String email, Role role) {
        return jwtUtil.generateToken(id, name, email, role);
    }

    // Extract email from token
    public String extractEmail(String token) {
        return jwtUtil.extractEmail(token);
    }

    // Extract ID from token
    public Long extractId(String token) {
        return jwtUtil.extractId(token);
    }

    // Extract name from token
    public String extractName(String token) {
        return jwtUtil.extractName(token);
    }

    // Extract role from token
    public Role extractRole(String token) {
        return jwtUtil.extractRole(token);
    }

    // Validate the token
    public boolean validateToken(String token, String userEmail) {
        return extractEmail(token).equals(userEmail);
    }
}
