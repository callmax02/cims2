package com.example.backend.security;

import com.example.backend.exception.ErrorResponse;
import com.example.backend.exception.InvalidJwtException;
import com.example.backend.model.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper; // Inject ObjectMapper to serialize JSON

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        try {
            if (!jwtUtil.isTokenValid(token)) { // This will throw InvalidJwtException if invalid
                chain.doFilter(request, response);
                return;
            }

            String email = jwtUtil.extractEmail(token);
            Role role = jwtUtil.extractRole(token);
            Long userId = jwtUtil.extractId(token);
            String authority = "ROLE_" + role.name().toUpperCase();
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(authority));

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);

            Map<String, Object> details = new HashMap<>();
            details.put("webDetails", new WebAuthenticationDetailsSource().buildDetails(request));
            details.put("userId", userId);
            authToken.setDetails(details);

            SecurityContextHolder.getContext().setAuthentication(authToken);
            chain.doFilter(request, response);
        } catch (InvalidJwtException ex) {
            // Handle InvalidJwtException and send custom response
            ErrorResponse errorResponse = new ErrorResponse(List.of(ex.getMessage()));
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getWriter(), errorResponse);
        }
    }
}