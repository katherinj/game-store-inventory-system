package com.katherinj.gamestore.service;

import com.katherinj.gamestore.exception.NotFoundException;
import com.katherinj.gamestore.model.Game;
import com.katherinj.gamestore.repository.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository){
        this.gameRepository = gameRepository;
    }

    public Game createGame(Game game){
        game.setId(null);
        return gameRepository.save(game);
    }

    public Game getGame(Long id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Game not found with id: " + id));
    }
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @Transactional
    public Game updateGame(Long id, Game updated) {
        Game existing = getGame(id);

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setEsrbRating(updated.getEsrbRating());
        existing.setStudio(updated.getStudio());
        existing.setPrice(updated.getPrice());
        existing.setQuantity(updated.getQuantity());

        return existing;
    }

    public void deleteGame(Long id) {
        Game existing = getGame(id);
        gameRepository.delete(existing);
    }

    public List<Game> searchByStudio(String studio) {
        return gameRepository.findByStudioContainingIgnoreCase(studio);
    }

    public List<Game> searchByEsrb(String esrbRating) {
        return gameRepository.findByEsrbRatingIgnoreCase(esrbRating);
    }

    public List<Game> searchByTitle(String title) {
        return gameRepository.findByTitleContainingIgnoreCase(title);
    }
}

