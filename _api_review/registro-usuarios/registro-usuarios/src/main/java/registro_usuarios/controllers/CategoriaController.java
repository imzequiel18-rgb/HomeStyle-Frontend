package registro_usuarios.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import registro_usuarios.dto.CategoriaDTO;
import registro_usuarios.entities.Categoria;
import registro_usuarios.services.CategoriaService;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    @Autowired
    private CategoriaService service;

    @PostMapping
    public CategoriaDTO agregar(Categoria categoria){
        return service.agregar(categoria);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id){
        service.eliminar(id);
    }

    @GetMapping
    public List<CategoriaDTO> obtenerTodos(){
        return service.obtenerTodos();
    }

    @GetMapping("/{id}")
    public CategoriaDTO obtenerCategoria(@PathVariable Long id){
        return service.obtenerCategoria(id);
    }

    @PutMapping("/{id}")
    public CategoriaDTO actualizar(@PathVariable Long id, @RequestBody Categoria actuCategoria){
        return service.actualizar(id,actuCategoria);
    }
}
