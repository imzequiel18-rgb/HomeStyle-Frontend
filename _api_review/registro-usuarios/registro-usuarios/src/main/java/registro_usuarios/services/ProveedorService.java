package registro_usuarios.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import registro_usuarios.dto.ProveedorDTO;
import registro_usuarios.entities.Proveedor;
import registro_usuarios.repositories.ProveedorRepository;

import java.util.List;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository repository;

    public ProveedorDTO agregar(Proveedor proveedor){
        Proveedor nuevoProveedor = repository.save(proveedor);

        return convertirDTO(nuevoProveedor);
    }

    public ProveedorDTO convertirDTO (Proveedor p){
        return new ProveedorDTO(
                p.getId(),
                p.getNombre(),
                p.getCorreo(),
                p.getTelefono()
        );
    }

    public ProveedorDTO actualizar(Long id, Proveedor proveedorActualizado){
        Proveedor p = repository.findById(id).orElseThrow(() -> new RuntimeException("No se enontro proveedor"));

        p.setNombre(proveedorActualizado.getNombre());
        p.setCorreo(proveedorActualizado.getCorreo());
        p.setTelefono(proveedorActualizado.getTelefono());

        Proveedor actualizado = repository.save(p);

        return convertirDTO(actualizado);
    }


    public void eliminar(Long id){
        repository.deleteById(id);
    }

    public List<ProveedorDTO> obtenerTodos(){
        List <Proveedor> proveedores = repository.findAll();

        return proveedores.stream()
                .map(this::convertirDTO)
                .toList();
    }

    public ProveedorDTO obtenerProveedor(Long id){
        Proveedor p = repository.findById(id).orElseThrow(() -> new RuntimeException("No se enontro proveedor"));
      return convertirDTO(p);
    }


}
