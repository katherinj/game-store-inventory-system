package com.katherinj.gamestore.repository;

import com.katherinj.gamestore.model.Console;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsoleRepository extends JpaRepository<Console, Long> {
    List<Console> findByManufacturerContainingIgnoreCase(String manufacturer);
    List<Console> findByModelContainingIgnoreCase(String model);
}
