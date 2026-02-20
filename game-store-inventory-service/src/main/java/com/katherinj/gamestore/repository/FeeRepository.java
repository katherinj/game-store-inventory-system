package com.katherinj.gamestore.repository;

import com.katherinj.gamestore.model.Fee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeeRepository extends JpaRepository<Fee, String> {
}