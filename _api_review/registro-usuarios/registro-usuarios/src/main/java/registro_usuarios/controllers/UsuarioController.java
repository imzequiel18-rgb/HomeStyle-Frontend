package registro_usuarios.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import registro_usuarios.dto.LoginRequestDTO;
import registro_usuarios.dto.LoginResponseDTO;
import registro_usuarios.dto.UsuarioDTO;
import registro_usuarios.entities.Usuario;
import registro_usuarios.services.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping
    public UsuarioDTO agregar(@RequestBody Usuario usuario){
        return service.agregar(usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id){
        service.eliminar(id);
    }

    @GetMapping
    public List<UsuarioDTO> obtenerTodos(){
        return service.obtenerTodosDTO();
    }

    @GetMapping("/{id}")
    public UsuarioDTO obtenerUsuario(@PathVariable Long id){
        return service.obtenerUsuarioDTO(id);
    }

    @PutMapping("/{id}")
    public UsuarioDTO actualizar(@PathVariable Long id, @RequestBody Usuario usuario){
        return service.actualizar(id, usuario);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request){

        return service.login(request);
    }

}
