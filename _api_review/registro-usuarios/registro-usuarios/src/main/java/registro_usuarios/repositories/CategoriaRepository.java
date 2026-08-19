package registro_usuarios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import registro_usuarios.entities.Categoria;


@Repository
public interface CategoriaRepository extends JpaRepository<Categoria , Long> {
}
