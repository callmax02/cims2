package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;

public interface AuthService {

    public User register(RegisterRequest request);
    public AuthResponse login(AuthRequest request);
}
