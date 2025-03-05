package com.example.backend.exception;

public class SelfOperationException extends RuntimeException {
    public SelfOperationException(String message) {
        super(message);
    }
}