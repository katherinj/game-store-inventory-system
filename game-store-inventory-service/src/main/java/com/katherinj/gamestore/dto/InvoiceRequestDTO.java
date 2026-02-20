package com.katherinj.gamestore.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceRequestDTO {

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotBlank
    @Size(max = 100)
    private String street;

    @NotBlank
    @Size(max = 50)
    private String city;

    @NotBlank
    @Size(max = 2)
    private String state;

    @NotBlank
    @Size(max = 10)
    private String zipcode;

    @NotBlank
    @Size(max = 50)
    private String itemType;   // "Game", "Console", "T-Shirt"

    @NotNull
    private Long itemId;

    @NotNull
    @Min(1)
    private Integer quantity;
}