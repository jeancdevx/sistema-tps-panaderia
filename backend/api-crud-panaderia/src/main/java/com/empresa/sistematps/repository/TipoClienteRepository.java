package com.empresa.sistematps.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.empresa.sistematps.entity.TipoCliente;

@Repository
public interface TipoClienteRepository extends JpaRepository<TipoCliente, Long> {
    
    Optional<TipoCliente> findByNombre(String nombre);
}