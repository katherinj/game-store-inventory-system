package com.katherinj.gamestore.service;

import com.katherinj.gamestore.exception.NotFoundException;
import com.katherinj.gamestore.model.TShirt;
import com.katherinj.gamestore.repository.TShirtRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TShirtService {

    private final TShirtRepository repository;

    public TShirtService(TShirtRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public TShirt createTShirt(TShirt shirt) {
        shirt.setId(null);
        return repository.save(shirt);
    }

    // READ ONE
    public TShirt getTShirt(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("TShirt not found with id: " + id));
    }

    // READ ALL
    public List<TShirt> getAllTShirts() {
        return repository.findAll();
    }

    // UPDATE
    @Transactional
    public TShirt updateTShirt(Long id, TShirt updated) {
        TShirt existing = getTShirt(id);

        existing.setSize(updated.getSize());
        existing.setColor(updated.getColor());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setQuantity(updated.getQuantity());

        return existing;
    }

    // DELETE
    public void deleteTShirt(Long id) {
        TShirt existing = getTShirt(id);
        repository.delete(existing);
    }

    // SEARCH
    public List<TShirt> searchByColor(String color) {
        return repository.findByColorContainingIgnoreCase(color);
    }

    public List<TShirt> searchBySize(String size) {
        return repository.findBySizeIgnoreCase(size);
    }

    public List<TShirt> searchByDescription(String description) {
        return repository.findByDescriptionContainingIgnoreCase(description);
    }

    // Optional: combined search
    public List<TShirt> searchByColorAndSize(String color, String size) {
        return repository.findByColorContainingIgnoreCaseAndSizeIgnoreCase(color, size);
    }
}
