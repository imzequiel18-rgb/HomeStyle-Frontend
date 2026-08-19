package registro_usuarios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import registro_usuarios.entities.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {


}
