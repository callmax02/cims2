package com.example.backend.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TypeConverter implements AttributeConverter<Type, String> {

    @Override
    public String convertToDatabaseColumn(Type attribute) {
        return attribute != null ? attribute.getDisplayName() : null;
    }

    @Override
    public Type convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        for (Type type : Type.values()) {
            if (type.getDisplayName().equals(dbData)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown type: " + dbData);
    }
}