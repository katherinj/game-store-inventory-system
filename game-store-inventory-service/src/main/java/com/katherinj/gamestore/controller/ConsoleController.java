package com.katherinj.gamestore.controller;

import com.katherinj.gamestore.model.Console;
import com.katherinj.gamestore.service.ConsoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consoles")
@CrossOrigin
public class ConsoleController {

    private final ConsoleService service;

    public ConsoleController(ConsoleService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Console create(@Valid @RequestBody Console console) {
        return service.createConsole(console);
    }

    // READ ALL
    @GetMapping
    public List<Console> getAll() {
        return service.getAllConsoles();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Console getById(@PathVariable Long id) {
        return service.getConsole(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Console update(@PathVariable Long id, @Valid @RequestBody Console updated) {
        return service.updateConsole(id, updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteConsole(id);
    }

    // SEARCH (manufacturer or model)
    @GetMapping("/search")
    public List<Console> search(
            @RequestParam(required = false) String manufacturer,
            @RequestParam(required = false) String model
    ) {
        if (manufacturer != null && !manufacturer.isBlank()) {
            return service.searchByManufacturer(manufacturer);
        }
        if (model != null && !model.isBlank()) {
            return service.searchByModel(model);
        }
        return service.getAllConsoles();
    }
}
