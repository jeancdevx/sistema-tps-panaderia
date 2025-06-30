package com.empresa.sistematps.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.empresa.sistematps.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    // Métodos de búsqueda por campos únicos
    Optional<Cliente> findByEmail(String email);
    
    // Verificar existencia por email
    boolean existsByEmail(String email);
    
    // Buscar todos los clientes ordenados por apellido y nombre
    @Query("SELECT c FROM Cliente c ORDER BY c.apellido ASC, c.nombre ASC")
    List<Cliente> findAllOrderByApellidoNombre();
    
    // Buscar por tipo de cliente
    @Query("SELECT c FROM Cliente c WHERE c.tipoCliente.nombre = :tipoCliente")
    List<Cliente> findByTipoCliente(@Param("tipoCliente") String tipoCliente);
    
    // Buscar por nombre o apellido (método original)
    @Query("SELECT c FROM Cliente c WHERE c.nombre LIKE %:nombre% OR c.apellido LIKE %:nombre%")
    List<Cliente> findByNombreContaining(@Param("nombre") String nombre);
    
    // Buscar por nombre o apellido (ignorando mayúsculas/minúsculas)
    @Query("SELECT c FROM Cliente c WHERE UPPER(c.nombre) LIKE UPPER(CONCAT('%', :busqueda, '%')) OR UPPER(c.apellido) LIKE UPPER(CONCAT('%', :busqueda, '%'))")
    List<Cliente> findByNombreOrApellidoContainingIgnoreCase(@Param("busqueda") String busqueda);
    
    // Contar clientes por tipo
    @Query("SELECT COUNT(c) FROM Cliente c WHERE c.tipoCliente.id = :tipoClienteId")
    Long countByTipoClienteId(@Param("tipoClienteId") Long tipoClienteId);
}