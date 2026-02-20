package com.katherinj.gamestore.controller;

import com.katherinj.gamestore.dto.InvoiceRequestDTO;
import com.katherinj.gamestore.model.Invoice;
import com.katherinj.gamestore.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    public Invoice create(@Valid @RequestBody InvoiceRequestDTO req) {
        return invoiceService.createInvoice(req);
    }

    @GetMapping
    public List<Invoice> list(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String state
    ) {
        return invoiceService.searchInvoices(name, state);
    }

    @GetMapping("/{id}")
    public Invoice get(@PathVariable Long id) {
        return invoiceService.getInvoice(id);
    }
}