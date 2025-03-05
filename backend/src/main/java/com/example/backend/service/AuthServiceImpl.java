package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.exception.DuplicateEmailException;
import com.example.backend.exception.InsufficientPrivilegesException;
import com.example.backend.exception.InvalidLoginCredentialsException;
import com.example.backend.exception.SelfOperationException;
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

    public boolean isNotSelf(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InsufficientPrivilegesException("Authentication required");
        }
    
        // Get user ID from authentication details
        Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
        Long currentUserId = (Long) details.get("userId");
    
        if (currentUserId == null) {
            throw new SecurityException("User ID not found in authentication details");
        }
    
        if (currentUserId.equals(id)) {
            throw new SelfOperationException("You cannot modify your own role or delete your account");
        }
    
        return true;
    }

    public boolean checkSuperAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InsufficientPrivilegesException("Authentication required");
        }
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_SUPERADMIN"));
        if (!isSuperAdmin) {
            throw new InsufficientPrivilegesException("Insufficient privileges: SUPERADMIN role required");
        }
        return true;
    }

    public boolean checkAdminOrSuperAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InsufficientPrivilegesException("Authentication required");
        }
        
        boolean hasRequiredRole = authentication.getAuthorities().stream()
            .anyMatch(grantedAuthority -> {
                String authority = grantedAuthority.getAuthority();
                return authority.equals("ROLE_ADMIN") || authority.equals("ROLE_SUPERADMIN");
            });
        
        if (!hasRequiredRole) {
            throw new InsufficientPrivilegesException("Insufficient privileges: ADMIN or SUPERADMIN role required");
        }
        return true;
    }

}
