package com.katherinj.gamestore.repository;

import com.katherinj.gamestore.model.TShirt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TShirtRepository extends JpaRepository<TShirt, Long> {
    List<TShirt> findByColorContainingIgnoreCase(String color);
    List<TShirt> findBySizeIgnoreCase(String size);
    List<TShirt> findByDescriptionContainingIgnoreCase(String description);
    List<TShirt> findByColorContainingIgnoreCaseAndSizeIgnoreCase(String color, String size);
}
