package com.katherinj.gamestore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "fee")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Fee {

    @Id
    @Column(name = "product_type", length = 50)
    @Size(max = 50)
    private String productType; // "Game", "Console", "T-Shirt"

    @NotNull
    @Digits(integer = 6, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal fee;
}