package com.example.backend.exception;

public class DuplicateAssetTagException extends RuntimeException {
    public DuplicateAssetTagException(String message) {
        super(message);
    }
}
