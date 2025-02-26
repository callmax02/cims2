package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.exception.DuplicateEmailException;
import com.example.backend.exception.InvalidLoginCredentialsException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    
    private UserRepository userRepository;

    public User login(LoginRequest loginRequest) {
        
        // Check if the user exists in the database
        User user = userRepository.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword())
            .orElseThrow(() -> new InvalidLoginCredentialsException());

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        return user;
    }

    public User createUser(User user) {

        // Check for duplicate email using findByEmail
        userRepository.findByEmail(user.getEmail()).ifPresent(existingUser -> {
            throw new DuplicateEmailException(user.getEmail());
        });

        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPassword(updatedUser.getPassword());
            
            return userRepository.save(existingUser);
            
        }).orElseThrow(() -> new UserNotFoundException(id));
    }

    public void deleteUser(Long id) {
        if(!userRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
    }
}
