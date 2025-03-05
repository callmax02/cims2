package com.example.backend.exception;

public class InsufficientPrivilegesException extends RuntimeException {
    public InsufficientPrivilegesException(String message) {
        super(message);
    }
}