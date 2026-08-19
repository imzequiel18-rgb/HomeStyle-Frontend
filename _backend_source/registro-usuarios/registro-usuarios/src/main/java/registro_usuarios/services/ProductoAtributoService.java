package registro_usuarios.services;

import registro_usuarios.dto.ProductoAtributoDTO;

import java.util.List;

public interface ProductoAtributoService {

    ProductoAtributoDTO guardarValor(ProductoAtributoDTO dto);

    ProductoAtributoDTO actualizarValor(Long id,
                                        ProductoAtributoDTO dto);

    void eliminar(Long id);

    ProductoAtributoDTO buscarPorId(Long id);

    List<ProductoAtributoDTO> listarPorProducto(Long productoId);

}