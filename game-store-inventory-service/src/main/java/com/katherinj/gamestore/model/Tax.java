package com.katherinj.gamestore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tax")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Tax {

    @Id
    @Size(max = 2)
    @Column(length = 2)
    private String state; // "NJ"

    @NotNull
    @Digits(integer = 3, fraction = 4)
    @Column(nullable = false, precision = 7, scale = 5)
    private BigDecimal rate;
}