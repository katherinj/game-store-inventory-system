package com.katherinj.gamestore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "invoices")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String name;

    @NotBlank @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String street;

    @NotBlank @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String city;

    @NotBlank @Size(max = 2)
    @Column(nullable = false, length = 2)
    private String state;

    @NotBlank @Size(max = 10)
    @Column(nullable = false, length = 10)
    private String zipcode;

    @NotBlank @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String itemType; // "Game", "Console", "T-Shirt"

    @NotNull
    @Column(nullable = false)
    private Long itemId;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal tax;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal processingFee;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}