package com.empresa.sistematps.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "tipo_pago")
public class TipoPago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "El nombre es requerido")
    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;
    
    // Constructors
    public TipoPago() {}
    
    public TipoPago(String nombre) {
        this.nombre = nombre;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    @Override
    public String toString() {
        return "TipoPago{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                '}';
    }
}
