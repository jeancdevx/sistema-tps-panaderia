package com.empresa.sistematps.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.empresa.sistematps.entity.Venta;
import com.empresa.sistematps.service.VentaService;

@RestController
@RequestMapping("/pedidos")
public class VentaController {
    
    @Autowired
    private VentaService ventaService;
    
    @GetMapping
    public ResponseEntity<List<Venta>> getAllPedidos() {
        List<Venta> pedidos = ventaService.findAll();
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Venta> getPedidoById(@PathVariable Long id) {
        Optional<Venta> pedido = ventaService.findById(id);
        return pedido.map(v -> new ResponseEntity<>(v, HttpStatus.OK))
                   .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Venta>> getPedidosByCliente(@PathVariable Long clienteId) {
        List<Venta> pedidos = ventaService.findByClienteId(clienteId);
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }
    
    @GetMapping("/fecha")
    public ResponseEntity<List<Venta>> getPedidosByFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<Venta> pedidos = ventaService.findByFechaBetween(fechaInicio, fechaFin);
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Venta>> getPedidosByEstado(@PathVariable String estado) {
        List<Venta> pedidos = ventaService.findByEstado(estado);
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }
    
    @GetMapping("/estado/{estado}/count")
    public ResponseEntity<Long> countPedidosByEstado(@PathVariable String estado) {
        Long count = ventaService.countByEstado(estado);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<?> createPedido(@Valid @RequestBody Venta pedido) {
        try {
            Venta nuevoPedido = ventaService.save(pedido);
            return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> updateEstadoPedido(@PathVariable Long id, @RequestParam String estado) {
        try {
            Venta pedidoActualizado = ventaService.updateEstado(id, estado);
            return new ResponseEntity<>(pedidoActualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePedido(@PathVariable Long id) {
        try {
            ventaService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}