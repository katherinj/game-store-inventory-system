package com.katherinj.gamestore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull @Column(nullable=false, length=50)
    private String name;

    @NotNull @Column(nullable=false, length=100)
    private String street;

    @NotNull @Column(nullable=false, length=50)
    private String city;

    @NotNull @Column(nullable=false, length=2)
    private String state;

    @NotNull @Column(nullable=false, length=10)
    private String zipcode;

    @NotNull
    @Column(nullable=false, precision=12, scale=2)
    private BigDecimal subtotal;

    @NotNull
    @Column(nullable=false, precision=12, scale=2)
    private BigDecimal tax;

    @NotNull
    @Column(nullable=false, precision=12, scale=2)
    private BigDecimal processingFee;

    @NotNull
    @Column(nullable=false, precision=12, scale=2)
    private BigDecimal total;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();
}