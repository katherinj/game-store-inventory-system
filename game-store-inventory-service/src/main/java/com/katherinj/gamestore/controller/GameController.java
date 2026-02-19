package com.katherinj.gamestore.controller;

import com.katherinj.gamestore.model.Game;
import com.katherinj.gamestore.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Game createGame(@Valid @RequestBody Game game) {
        return gameService.createGame(game);
    }

    // READ ALL
    @GetMapping
    public List<Game> getAllGames() {
        return gameService.getAllGames();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Game getGame(@PathVariable Long id) {
        return gameService.getGame(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Game updateGame(@PathVariable Long id, @Valid @RequestBody Game game) {
        return gameService.updateGame(id, game);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
    }

    // SEARCH (one endpoint)
    @GetMapping("/search")
    public List<Game> search(
            @RequestParam(required = false) String studio,
            @RequestParam(required = false) String esrb,
            @RequestParam(required = false) String title
    ) {
        if (studio != null) return gameService.searchByStudio(studio);
        if (esrb != null) return gameService.searchByEsrb(esrb);
        if (title != null) return gameService.searchByTitle(title);

        return gameService.getAllGames();
    }
}
