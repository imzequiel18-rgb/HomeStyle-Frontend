package registro_usuarios.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import registro_usuarios.dto.LoginRequestDTO;
import registro_usuarios.dto.LoginResponseDTO;
import registro_usuarios.dto.UsuarioDTO;
import registro_usuarios.entities.Usuario;
import registro_usuarios.repositories.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public UsuarioDTO agregar(Usuario usuario){
        Usuario guardado = repository.save(usuario);

        return convertirDTO(guardado);
    }

    private UsuarioDTO convertirDTO(Usuario u){
        return new UsuarioDTO(
                u.getId(),
                u.getUserName(),
                u.getEmail(),
                u.getPhoneNumber()
        );
    }

    public void eliminar(Long id){
        repository.deleteById(id);
    }

    public UsuarioDTO obtenerUsuarioDTO(Long id){
        Usuario u = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return convertirDTO(u);
    }

    public List<UsuarioDTO> obtenerTodosDTO() {
        List<Usuario> usuarios = repository.findAll();

        return usuarios.stream()
                .map(this::convertirDTO)
                .toList();
    }

    public UsuarioDTO actualizar(Long id, Usuario usuarioActualizado){
        Usuario u = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        u.setUserName(usuarioActualizado.getUserName());
        u.setEmail(usuarioActualizado.getEmail());
        u.setPassword(usuarioActualizado.getPassword());
        u.setPhoneNumber(usuarioActualizado.getPhoneNumber());
        u.setRol(usuarioActualizado.getRol());

        Usuario actualizado = repository.save(u);

        return convertirDTO(actualizado);
    }

    public LoginResponseDTO login(LoginRequestDTO request){

        Usuario usuario = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if(!usuario.getPassword().equals(request.getPassword())){
            throw new RuntimeException("Contraseña incorrecta");
        }

        return new LoginResponseDTO(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }
}
