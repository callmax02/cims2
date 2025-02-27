package com.example.backend.exception;

public class UserWithEmailNotFoundException extends RuntimeException{
            
    public UserWithEmailNotFoundException(){
        super("Invalid credentials. Please try again.");
    }
    
}
