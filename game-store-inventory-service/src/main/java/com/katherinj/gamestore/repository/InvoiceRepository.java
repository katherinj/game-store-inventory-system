package com.katherinj.gamestore.repository;

import com.katherinj.gamestore.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByNameContainingIgnoreCase(String name);
}