package com.example.backend.exception;

public class FailedToGenerateQRException extends RuntimeException{
    public FailedToGenerateQRException() {
        super("Failed to generate QR code.");
    }
}