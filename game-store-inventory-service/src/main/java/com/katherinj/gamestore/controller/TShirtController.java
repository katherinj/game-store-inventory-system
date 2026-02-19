package com.katherinj.gamestore.controller;

import com.katherinj.gamestore.model.TShirt;
import com.katherinj.gamestore.service.TShirtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tshirts")
@CrossOrigin // optional: you can remove this if you use a global CORS config
public class TShirtController {

    private final TShirtService service;

    public TShirtController(TShirtService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TShirt create(@Valid @RequestBody TShirt shirt) {
        return service.createTShirt(shirt);
    }

    // READ ALL
    @GetMapping
    public List<TShirt> getAll() {
        return service.getAllTShirts();
    }

    // READ ONE
    @GetMapping("/{id}")
    public TShirt getById(@PathVariable Long id) {
        return service.getTShirt(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public TShirt update(@PathVariable Long id, @Valid @RequestBody TShirt updated) {
        return service.updateTShirt(id, updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteTShirt(id);
    }

    // SEARCH (supports color, size, description, and color+size)
    @GetMapping("/search")
    public List<TShirt> search(
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String description
    ) {
        // Most specific first
        if (color != null && !color.isBlank() && size != null && !size.isBlank()) {
            return service.searchByColorAndSize(color, size);
        }
        if (color != null && !color.isBlank()) {
            return service.searchByColor(color);
        }
        if (size != null && !size.isBlank()) {
            return service.searchBySize(size);
        }
        if (description != null && !description.isBlank()) {
            return service.searchByDescription(description);
        }

        // No query params -> return everything
        return service.getAllTShirts();
    }
}
