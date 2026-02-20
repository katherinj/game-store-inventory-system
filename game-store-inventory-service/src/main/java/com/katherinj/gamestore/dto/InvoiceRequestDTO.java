package com.katherinj.gamestore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InvoiceRequestDTO {

    @NotBlank @Size(max=50)
    private String name;

    @NotBlank @Size(max=100)
    private String street;

    @NotBlank @Size(max=50)
    private String city;

    @NotBlank @Size(max=2)
    private String state;

    @NotBlank @Size(max=10)
    private String zipcode;

    @NotNull
    @Size(min = 1)
    @Valid
    private List<InvoiceItemRequestDTO> items;
}