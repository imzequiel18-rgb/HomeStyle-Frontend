package registro_usuarios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import registro_usuarios.entities.Pedido;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByNumeroPedido(String numeroPedido);

    List<Pedido> findByUsuarioId(Long usuarioId);
}
