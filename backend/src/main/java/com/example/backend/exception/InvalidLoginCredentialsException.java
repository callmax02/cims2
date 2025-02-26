package com.example.backend.exception;

public class InvalidLoginCredentialsException extends RuntimeException{
            
    public InvalidLoginCredentialsException(){
        super("A user with those credentials does not exist in the database. Please try again.");
    }
}
