package registro_usuarios.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import registro_usuarios.dto.ProveedorDTO;
import registro_usuarios.entities.Proveedor;
import registro_usuarios.services.ProveedorService;

import java.util.List;


@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {

    @Autowired
    private ProveedorService service;

    @PostMapping
    public ProveedorDTO agregar(@RequestBody Proveedor proveedor){
        return service.agregar(proveedor);
    }

    @DeleteMapping("/{id}")
    public void elimnar(@PathVariable Long id){
        service.eliminar(id);
    }

    @GetMapping
    public List<ProveedorDTO> obtenerTodos(){
        return service.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ProveedorDTO obtenerProveedor(@PathVariable Long id){
        return service.obtenerProveedor(id);
    }

    @PutMapping("/{id}")
    public ProveedorDTO acualizar(@PathVariable Long id, @RequestBody Proveedor proveedor){
       return service.actualizar(id, proveedor);
    }

}
