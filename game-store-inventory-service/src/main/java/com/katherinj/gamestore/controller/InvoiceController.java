package com.katherinj.gamestore.controller;

import com.katherinj.gamestore.dto.InvoiceRequestDTO;
import com.katherinj.gamestore.model.Invoice;
import com.katherinj.gamestore.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin
public class InvoiceController {

    private final InvoiceService service;

    public InvoiceController(InvoiceService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Invoice create(@Valid @RequestBody InvoiceRequestDTO request) {
        return service.createInvoice(request);
    }
}