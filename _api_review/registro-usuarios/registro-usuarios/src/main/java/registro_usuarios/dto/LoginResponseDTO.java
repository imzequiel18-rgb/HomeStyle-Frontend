package registro_usuarios.dto;

import registro_usuarios.entities.Usuario.Rol;

public class LoginResponseDTO {

    private Long id;
    private String email;
    private Rol rol;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(Long id, String email, Rol rol) {
        this.id = id;
        this.email = email;
        this.rol = rol;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

}
