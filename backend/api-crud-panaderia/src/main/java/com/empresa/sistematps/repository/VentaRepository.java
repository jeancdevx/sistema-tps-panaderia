package com.empresa.sistematps.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.empresa.sistematps.entity.Venta;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    
    List<Venta> findByClienteId(Long clienteId);
    
    @Query("SELECT v FROM Venta v WHERE v.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY v.fecha DESC")
    List<Venta> findByFechaBetween(@Param("fechaInicio") LocalDate fechaInicio, 
                                   @Param("fechaFin") LocalDate fechaFin);
    
    @Query("SELECT v FROM Venta v ORDER BY v.fecha DESC")
    List<Venta> findAllOrderByFechaDesc();
    
    @Query("SELECT v FROM Venta v WHERE v.estado = :estado")
    List<Venta> findByEstado(@Param("estado") String estado);
    
    @Query("SELECT COUNT(v) FROM Venta v WHERE v.estado = :estado")
    Long countByEstado(@Param("estado") String estado);
}