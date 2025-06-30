package com.empresa.sistematps.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.empresa.sistematps.entity.TipoPago;

@Repository
public interface TipoPagoRepository extends JpaRepository<TipoPago, Long> {
    
    Optional<TipoPago> findByNombre(String nombre);
    
    boolean existsByNombre(String nombre);
}
