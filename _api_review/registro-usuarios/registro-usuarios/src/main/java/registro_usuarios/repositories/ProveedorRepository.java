package registro_usuarios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import registro_usuarios.entities.Proveedor;

@Repository
public interface ProveedorRepository extends JpaRepository <Proveedor, Long> {
}
