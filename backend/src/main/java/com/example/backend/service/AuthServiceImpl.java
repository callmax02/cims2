package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.exception.DuplicateEmailException;
import com.example.backend.exception.InvalidLoginCredentialsException;
import com.example.backend.exception.UserWithEmailNotFoundException;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service("authServiceImpl")
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateEmailException(request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        return user;
    }

    public AuthResponse login(AuthRequest request) {
        
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UserWithEmailNotFoundException());

        if (!new BCryptPasswordEncoder().matches(request.getPassword(), user.getPassword())) {
            throw new InvalidLoginCredentialsException();
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getEmail(), user.getRole());

        return new AuthResponse(token);
    }

    public boolean isNotSelf(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        Object details = authentication.getDetails();
        if (details instanceof Map) {
            Map<?, ?> detailsMap = (Map<?, ?>) details;
            Long currentUserId = (Long) detailsMap.get("userId");
            return currentUserId != null && !currentUserId.equals(userId);
        }
        return false;
    }

}
