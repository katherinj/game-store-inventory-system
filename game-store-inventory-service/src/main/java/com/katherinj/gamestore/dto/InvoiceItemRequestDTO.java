package com.katherinj.gamestore.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InvoiceItemRequestDTO {

    @NotBlank
    @Size(max = 50)
    private String itemType;

    @NotNull
    private Long itemId;

    @NotNull
    @Min(1)
    private Integer quantity;
}