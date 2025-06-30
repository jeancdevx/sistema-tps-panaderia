package com.empresa.sistematps.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.empresa.sistematps.entity.Categoria;
import com.empresa.sistematps.repository.CategoriaRepository;


@Service
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public List<Categoria> findAll() {
        return categoriaRepository.findAllOrderByNombre();
    }
    
    public Optional<Categoria> findById(Long id) {
        return categoriaRepository.findById(id);
    }
    
    public Categoria save(Categoria categoria) {
        if (categoriaRepository.existsByNombre(categoria.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }
        return categoriaRepository.save(categoria);
    }
    
    public Categoria update(Long id, Categoria categoria) {
        Optional<Categoria> existingCategoria = categoriaRepository.findById(id);
        if (existingCategoria.isEmpty()) {
            throw new RuntimeException("Categoría no encontrada");
        }
        
        Categoria categoriaToUpdate = existingCategoria.get();
        
        if (!categoriaToUpdate.getNombre().equals(categoria.getNombre()) && 
            categoriaRepository.existsByNombre(categoria.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }
        
        categoriaToUpdate.setNombre(categoria.getNombre());
        return categoriaRepository.save(categoriaToUpdate);
    }
    
    public void deleteById(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }
}