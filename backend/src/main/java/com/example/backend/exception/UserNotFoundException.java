package com.example.backend.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(Long id){
        super("User: '" + id + "' does not exist in the database.");
    }
}
