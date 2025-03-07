package com.example.backend.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DepartmentConverter implements AttributeConverter<Department, String> {

    @Override
    public String convertToDatabaseColumn(Department attribute) {
        return attribute != null ? attribute.getDisplayName() : null;
    }

    @Override
    public Department convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        for (Department dept : Department.values()) {
            if (dept.getDisplayName().equals(dbData)) {
                return dept;
            }
        }
        throw new IllegalArgumentException("Unknown department: " + dbData);
    }
}