package com.empresa.sistematps.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.empresa.sistematps.entity.Empleado;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    
    Optional<Empleado> findByDni(String dni);
    
    Optional<Empleado> findByEmail(String email);
    
    boolean existsByDni(String dni);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT e FROM Empleado e WHERE e.cargo.nombre = :cargoNombre")
    List<Empleado> findByCargoNombre(@Param("cargoNombre") String cargoNombre);
    
    @Query("SELECT e FROM Empleado e WHERE UPPER(e.nombre) LIKE UPPER(CONCAT('%', :busqueda, '%')) OR UPPER(e.apellido) LIKE UPPER(CONCAT('%', :busqueda, '%'))")
    List<Empleado> findByNombreOrApellidoContainingIgnoreCase(@Param("busqueda") String busqueda);
    
    @Query("SELECT e FROM Empleado e ORDER BY e.apellido ASC, e.nombre ASC")
    List<Empleado> findAllOrderByApellidoNombre();
}
