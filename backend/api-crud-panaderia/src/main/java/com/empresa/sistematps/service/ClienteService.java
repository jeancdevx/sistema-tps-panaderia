package com.empresa.sistematps.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.empresa.sistematps.entity.Cliente;
import com.empresa.sistematps.repository.ClienteRepository;

@Service
@Transactional
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Cliente> findAll() {
        return clienteRepository.findAllOrderByApellidoNombre();
    }
    
    public Optional<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }
    
    public Optional<Cliente> findByEmail(String email) {
        return clienteRepository.findByEmail(email);
    }
    
    public List<Cliente> findByNombre(String nombre) {
        return clienteRepository.findByNombreOrApellidoContainingIgnoreCase(nombre);
    }
    
    public List<Cliente> findByTipoCliente(String tipoCliente) {
        return clienteRepository.findByTipoCliente(tipoCliente);
    }
    
    public Cliente save(Cliente cliente) {
        // Validar email único
        if (cliente.getEmail() != null && clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new RuntimeException("Ya existe un cliente con ese email");
        }
        
        return clienteRepository.save(cliente);
    }
    
    public Cliente update(Long id, Cliente cliente) {
        Optional<Cliente> existingCliente = clienteRepository.findById(id);
        if (existingCliente.isEmpty()) {
            throw new RuntimeException("Cliente no encontrado");
        }
        
        Cliente clienteToUpdate = existingCliente.get();
        
        // Verificar si el email ya existe en otro cliente
        if (cliente.getEmail() != null && 
            !cliente.getEmail().equals(clienteToUpdate.getEmail()) &&
            clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new RuntimeException("Ya existe un cliente con ese email");
        }
        
        // Actualizar campos
        clienteToUpdate.setNombre(cliente.getNombre());
        clienteToUpdate.setApellido(cliente.getApellido());
        clienteToUpdate.setEmail(cliente.getEmail());
        
        if (cliente.getTipoCliente() != null) {
            clienteToUpdate.setTipoCliente(cliente.getTipoCliente());
        }
        
        return clienteRepository.save(clienteToUpdate);
    }
    
    public void deleteById(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
        }
        clienteRepository.deleteById(id);
    }
    
    public boolean existsByEmail(String email) {
        return clienteRepository.existsByEmail(email);
    }
    
    public Long countByTipoCliente(Long tipoClienteId) {
        return clienteRepository.countByTipoClienteId(tipoClienteId);
    }
}