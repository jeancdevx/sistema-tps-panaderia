package com.empresa.sistematps.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.empresa.sistematps.entity.DetalleVenta;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
    
    List<DetalleVenta> findByVentaId(Long ventaId);
    
    List<DetalleVenta> findByProductoId(Long productoId);
    
    @Query("SELECT dv FROM DetalleVenta dv WHERE dv.venta.id = :ventaId ORDER BY dv.id")
    List<DetalleVenta> findByVentaIdOrderById(@Param("ventaId") Long ventaId);
}