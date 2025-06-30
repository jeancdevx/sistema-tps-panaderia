package com.empresa.sistematps.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.empresa.sistematps.entity.TipoCliente;
import com.empresa.sistematps.service.TipoClienteService;

@RestController
@RequestMapping("/tipos-cliente")
public class TipoClienteController {
    
    @Autowired
    private TipoClienteService tipoClienteService;
    
    @GetMapping
    public ResponseEntity<List<TipoCliente>> getAllTiposCliente() {
        try {
            List<TipoCliente> tipos = tipoClienteService.findAll();
            return ResponseEntity.ok(tipos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TipoCliente> getTipoClienteById(@PathVariable Long id) {
        try {
            Optional<TipoCliente> tipo = tipoClienteService.findById(id);
            return tipo.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}