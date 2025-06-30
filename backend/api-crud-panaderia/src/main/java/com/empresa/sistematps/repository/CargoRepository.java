package com.empresa.sistematps.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.empresa.sistematps.entity.Cargo;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {
    
    Optional<Cargo> findByNombre(String nombre);
    
    boolean existsByNombre(String nombre);
}
