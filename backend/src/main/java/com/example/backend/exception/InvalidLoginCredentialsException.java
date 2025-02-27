package com.example.backend.exception;

public class InvalidLoginCredentialsException extends RuntimeException{
            
    public InvalidLoginCredentialsException(){
        super("Invalid credentials. Please try again.");
    }
}
