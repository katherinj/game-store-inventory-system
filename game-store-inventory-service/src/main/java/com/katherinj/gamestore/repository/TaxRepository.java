package com.katherinj.gamestore.repository;

import com.katherinj.gamestore.model.Tax;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaxRepository extends JpaRepository<Tax, String> {
}