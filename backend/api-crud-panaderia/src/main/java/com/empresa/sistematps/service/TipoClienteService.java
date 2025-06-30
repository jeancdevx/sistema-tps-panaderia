package com.empresa.sistematps.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.empresa.sistematps.entity.TipoCliente;
import com.empresa.sistematps.repository.TipoClienteRepository;

@Service
@Transactional
public class TipoClienteService {
    
    @Autowired
    private TipoClienteRepository tipoClienteRepository;
    
    public List<TipoCliente> findAll() {
        return tipoClienteRepository.findAll();
    }
    
    public Optional<TipoCliente> findById(Long id) {
        return tipoClienteRepository.findById(id);
    }
    
    public Optional<TipoCliente> findByNombre(String nombre) {
        return tipoClienteRepository.findByNombre(nombre);
    }
}