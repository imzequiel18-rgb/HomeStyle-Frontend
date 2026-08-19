package registro_usuarios.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import registro_usuarios.dto.ProductoAdminDTO;
import registro_usuarios.dto.ProductoClienteDTO;
import registro_usuarios.entities.Producto;
import registro_usuarios.services.ProductoService;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoService service;

    @PostMapping
    public ProductoAdminDTO agregar(@RequestBody Producto producto){
        return service.agregar(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id){
        service.eliminar(id);
    }

    @PutMapping("/{id}")
    public ProductoAdminDTO actualizar(@PathVariable Long id, @RequestBody Producto producto){
        return service.actualizar(id, producto);
    }

    @GetMapping
    public List<ProductoClienteDTO> obtenerTodos(){
        return service.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ProductoClienteDTO obtenerProducto(@PathVariable Long id){
        return service.obtenerProducto(id);
    }

}
