package registro_usuarios.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import registro_usuarios.dto.CategoriaDTO;
import registro_usuarios.entities.Categoria;
import registro_usuarios.repositories.CategoriaRepository;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    public CategoriaDTO agregar(Categoria categoria){
        Categoria nuevaCategoria = repository.save(categoria);

        return convertirDTO(nuevaCategoria);
    }

    private CategoriaDTO convertirDTO(Categoria c){
        return new CategoriaDTO(
                c.getId(),
                c.getNombre()
        );
    }

    public void eliminar(long id){
        repository.deleteById(id);
    }

    public CategoriaDTO actualizar(Long id, Categoria actuCategoria){
        //se busca por id
        Categoria c = repository.findById(id).orElseThrow(() -> new RuntimeException("categoria no encontrada"));

        //se actualza el valor
        c.setNombre(actuCategoria.getNombre());

        //se guardan los cambios
        Categoria actualizado =  repository.save(c);

        //lo convierte a DTO
        return convertirDTO(actualizado);
    }

    public List<CategoriaDTO> obtenerTodos(){
        List <Categoria> categorias = repository.findAll();

        return categorias.stream()
                .map(this::convertirDTO)
                .toList();
    }

    public CategoriaDTO obtenerCategoria(Long id){
        Categoria c = repository.findById(id).orElseThrow(() -> new RuntimeException("categoria no encontrada"));

        return convertirDTO(c);
    }
}
