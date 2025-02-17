package com.example.backend.exception;

public class ItemNotFoundException extends RuntimeException{
    public ItemNotFoundException(Long id) {
        super("Item: '" + id + "' does not exist in the database.");
    }
}
