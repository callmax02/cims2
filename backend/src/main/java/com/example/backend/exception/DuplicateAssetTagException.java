package com.example.backend.exception;

public class DuplicateAssetTagException extends RuntimeException {
    public DuplicateAssetTagException(String assetTag) {
        super("The asset tag: '" + assetTag + "' is already in use.");
    }
}