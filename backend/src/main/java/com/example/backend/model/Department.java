package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Department {
    GENERAL_SERVICES_FACILITIES("General Services / Facilities"),
    IT("IT");

    private final String displayName;

    Department(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}