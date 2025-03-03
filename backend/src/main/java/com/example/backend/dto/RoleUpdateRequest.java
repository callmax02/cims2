package com.example.backend.dto;

import com.example.backend.model.Role;

public class RoleUpdateRequest {
    private Role role;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}