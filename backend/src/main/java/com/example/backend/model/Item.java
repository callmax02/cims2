package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Assigning Department is required")
    private Department assigningDepartment;

    @Column(unique = true)
    private String assetTag;

    @NotNull(message = "Type is required")
    private Type type;

    @NotBlank(message = "SubType is required")
    private String subType;

    private String serial;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Default Location is required")
    private String defaultLocation;

    @Lob
    private byte[] qrCode;
}