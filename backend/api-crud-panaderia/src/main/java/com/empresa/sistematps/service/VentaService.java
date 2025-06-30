package com.empresa.sistematps.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.empresa.sistematps.entity.DetalleVenta;
import com.empresa.sistematps.entity.Producto;
import com.empresa.sistematps.entity.Venta;
import com.empresa.sistematps.repository.ProductoRepository;
import com.empresa.sistematps.repository.VentaRepository;

@Service
public class VentaService {
    
    @Autowired
    private VentaRepository ventaRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Venta> findAll() {
        return ventaRepository.findAllOrderByFechaDesc();
    }
    
    public Optional<Venta> findById(Long id) {
        return ventaRepository.findById(id);
    }
    
    public List<Venta> findByClienteId(Long clienteId) {
        return ventaRepository.findByClienteId(clienteId);
    }
    
    public List<Venta> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return ventaRepository.findByFechaBetween(fechaInicio, fechaFin);
    }
    
    public List<Venta> findByEstado(String estado) {
        return ventaRepository.findByEstado(estado);
    }
    
    public Long countByEstado(String estado) {
        return ventaRepository.countByEstado(estado);
    }
    
    @Transactional
    public Venta save(Venta venta) {
        // Verificar stock de productos
        if (venta.getDetalles() != null) {
            for (DetalleVenta detalle : venta.getDetalles()) {
                Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detalle.getProducto().getId()));
                
                // Verificar stock
                if (producto.getStock() < detalle.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
                }
                
                detalle.setVenta(venta);
                
                // Actualizar stock
                producto.setStock(producto.getStock() - detalle.getCantidad());
                productoRepository.save(producto);
            }
        }
        
        venta.setFecha(LocalDate.now());
        
        return ventaRepository.save(venta);
    }
    
    @Transactional
    public Venta updateEstado(Long id, String nuevoEstado) {
        Optional<Venta> existingVenta = ventaRepository.findById(id);
        if (existingVenta.isEmpty()) {
            throw new RuntimeException("Pedido no encontrado");
        }
        
        Venta venta = existingVenta.get();
        venta.setEstado(nuevoEstado);
        
        return ventaRepository.save(venta);
    }
    
    public void deleteById(Long id) {
        if (!ventaRepository.existsById(id)) {
            throw new RuntimeException("Pedido no encontrado");
        }
        ventaRepository.deleteById(id);
    }
}