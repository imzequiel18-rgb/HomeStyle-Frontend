package registro_usuarios.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import registro_usuarios.dto.ProductoAdminDTO;
import registro_usuarios.dto.ProductoClienteDTO;
import registro_usuarios.entities.Producto;
import registro_usuarios.repositories.ProductoRepository;

import java.util.List;


@Service
public class ProductoService {

    @Autowired
    private ProductoRepository repository;

    public ProductoAdminDTO agregar(Producto producto){
        Producto guardado = repository.save(producto);

        return convertirAdminDTO(guardado);
    }

    private ProductoAdminDTO convertirAdminDTO(Producto p){
        return new ProductoAdminDTO(
                p.getId(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecioVenta(),
                p.getDimensiones(),
                p.getPeso(),
                p.getStock(),
                p.getImagenUrl(),
                p.getPrecioCosto(),
                p.getUbicacionBodega()
        );
    }

    public void eliminar(Long id){
        repository.deleteById(id);
    }

    public ProductoAdminDTO actualizar(Long id, Producto productoActulizado){
        Producto p = repository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        p.setNombre(productoActulizado.getNombre());
        p.setDescripcion(productoActulizado.getDescripcion());
        p.setPrecioVenta(productoActulizado.getPrecioVenta());
        p.setDimensiones(productoActulizado.getDimensiones());
        p.setPeso(productoActulizado.getPeso());
        p.setStock(productoActulizado.getStock());
        p.setImagenUrl(productoActulizado.getImagenUrl());
        p.setPrecioCosto(productoActulizado.getPrecioCosto());
        p.setUbicacionBodega(productoActulizado.getUbicacionBodega());
        p.setProveedor(productoActulizado.getProveedor());

        Producto actualizado = repository.save(p);//guarda los cambios que se hicieron

        return convertirAdminDTO(actualizado); //el DTO obtiene los datos que NO son sensibles
    }

    public List<ProductoClienteDTO> obtenerTodos(){
        List <Producto> productos = repository.findAll();

        return productos.stream()
                .map(this::convertirClienteDTO)
                .toList();
    }

    public ProductoClienteDTO obtenerProducto(Long id){
        Producto p = repository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        return convertirClienteDTO(p);
    }

    private ProductoClienteDTO convertirClienteDTO(Producto p){
        return new ProductoClienteDTO(
                p.getPeso(),
                p.getId(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecioVenta(),
                p.getDimensiones(),
                p.getStock(),
                p.getImagenUrl()
        );
    }
}
