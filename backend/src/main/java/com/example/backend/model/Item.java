package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Asset Tag is required")
    @Column(unique = true)
    private String assetTag;

    @NotBlank(message = "Serial is required")
    // @Column(unique = true)
    private String serial;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Default Location is required")
    private String defaultLocation;

    @Lob
    private byte[] image;

    @Lob
    private byte[] qrCode;
}
