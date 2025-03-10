package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Type {
    CO("Computers / Peripherals"),
    FU("Furnitures & Fixtures"),
    CA("Cabinets / Enclosures"),
    EL("Electronic Appliances");

    private final String displayName;

    Type(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}