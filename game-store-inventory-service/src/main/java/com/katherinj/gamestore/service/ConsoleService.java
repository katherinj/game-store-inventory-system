package com.katherinj.gamestore.service;

import com.katherinj.gamestore.exception.NotFoundException;
import com.katherinj.gamestore.model.Console;
import com.katherinj.gamestore.repository.ConsoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConsoleService {

    private final ConsoleRepository repository;

    public ConsoleService(ConsoleRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Console createConsole(Console console) {
        console.setId(null);
        return repository.save(console);
    }

    // READ ONE
    public Console getConsole(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Console not found with id: " + id));
    }

    // READ ALL
    public List<Console> getAllConsoles() {
        return repository.findAll();
    }

    // UPDATE
    @Transactional
    public Console updateConsole(Long id, Console updated) {
        Console existing = getConsole(id);

        existing.setModel(updated.getModel());
        existing.setManufacturer(updated.getManufacturer());
        existing.setMemoryAmount(updated.getMemoryAmount());
        existing.setProcessor(updated.getProcessor());
        existing.setPrice(updated.getPrice());
        existing.setQuantity(updated.getQuantity());

        return existing;
    }

    // DELETE
    public void deleteConsole(Long id) {
        Console existing = getConsole(id);
        repository.delete(existing);
    }

    // SEARCH
    public List<Console> searchByManufacturer(String manufacturer) {
        return repository.findByManufacturerContainingIgnoreCase(manufacturer);
    }

    public List<Console> searchByModel(String model) {
        return repository.findByModelContainingIgnoreCase(model);
    }
}
