package com.example.backend.service;

import java.util.List;
import com.example.backend.model.User;

public interface UserService {
    public List<User> getAllUsers();
    public User getUserById(Long id);
    public User createUser(User user);
    public User updateUser(Long id, User user);
    public void deleteUser(Long id);
}
