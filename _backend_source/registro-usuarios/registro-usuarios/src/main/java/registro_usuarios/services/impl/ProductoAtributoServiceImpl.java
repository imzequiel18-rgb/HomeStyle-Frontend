package registro_usuarios.services.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import registro_usuarios.dto.ProductoAtributoDTO;
import registro_usuarios.entities.Atributo;
import registro_usuarios.entities.Producto;
import registro_usuarios.entities.ProductoAtributo;
import registro_usuarios.exceptions.RecursoDuplicadoException;
import registro_usuarios.exceptions.RecursoNoEncontradoException;
import registro_usuarios.mapper.ProductoAtributoMapper;
import registro_usuarios.repositories.AtributoRepository;
import registro_usuarios.repositories.ProductoAtributoRepository;
import registro_usuarios.repositories.ProductoRepository;
import registro_usuarios.services.ProductoAtributoService;

import java.util.List;

@Service
@Transactional
public class ProductoAtributoServiceImpl implements ProductoAtributoService {
    private final ProductoAtributoRepository productoAtributoRepository;

    private final ProductoRepository productoRepository;

    private final AtributoRepository atributoRepository;

    private final ProductoAtributoMapper productoAtributoMapper;

    public ProductoAtributoServiceImpl(
            ProductoAtributoRepository productoAtributoRepository,
            ProductoRepository productoRepository,
            AtributoRepository atributoRepository,
            ProductoAtributoMapper productoAtributoMapper) {

        this.productoAtributoRepository = productoAtributoRepository;
        this.productoRepository = productoRepository;
        this.atributoRepository = atributoRepository;
        this.productoAtributoMapper = productoAtributoMapper;
    }

    private Producto obtenerProducto(Long id) {

        return productoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Producto no encontrado con ID: " + id));

    }

    private Atributo obtenerAtributo(Long id) {

        return atributoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Atributo no encontrado con ID: " + id));

    }


    private ProductoAtributo obtenerValor(Long id) {

        return productoAtributoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Valor de atributo no encontrado con ID: " + id));

    }

    private void validarRelacion(Long productoId,
                                 Long atributoId) {

        if (productoAtributoRepository
                .existsByProductoIdAndAtributoId(
                        productoId,
                        atributoId)) {

            throw new RecursoDuplicadoException(
                    "El producto ya tiene asignado este atributo.");

        }

    }

    @Override
    public ProductoAtributoDTO guardarValor(ProductoAtributoDTO dto) {

        validarRelacion(
                dto.getProductoId(),
                dto.getAtributoId());

        Producto producto = obtenerProducto(
                dto.getProductoId());

        Atributo atributo = obtenerAtributo(
                dto.getAtributoId());

        ProductoAtributo productoAtributo =
                productoAtributoMapper.toEntity(dto);

        productoAtributo.setProducto(producto);

        productoAtributo.setAtributo(atributo);

        ProductoAtributo guardado =
                productoAtributoRepository.save(productoAtributo);

        return productoAtributoMapper.toDTO(guardado);

    }

    @Override
    public ProductoAtributoDTO actualizarValor(Long id,
                                               ProductoAtributoDTO dto) {

        ProductoAtributo valor = obtenerValor(id);

        if (!valor.getProducto().getId().equals(dto.getProductoId())
                || !valor.getAtributo().getId().equals(dto.getAtributoId())) {

            validarRelacion(
                    dto.getProductoId(),
                    dto.getAtributoId());
        }

        Producto producto = obtenerProducto(dto.getProductoId());

        Atributo atributo = obtenerAtributo(dto.getAtributoId());

        valor.setProducto(producto);
        valor.setAtributo(atributo);
        valor.setValor(dto.getValor());

        ProductoAtributo actualizado =
                productoAtributoRepository.save(valor);

        return productoAtributoMapper.toDTO(actualizado);

    }

    @Override
    @Transactional(readOnly = true)
    public ProductoAtributoDTO buscarPorId(Long id) {

        return productoAtributoMapper.toDTO(
                obtenerValor(id));

    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoAtributoDTO> listarPorProducto(Long productoId) {

        obtenerProducto(productoId);

        return productoAtributoMapper.toDTOList(
                productoAtributoRepository.findByProductoId(productoId));

    }

    @Override
    public void eliminar(Long id) {

        ProductoAtributo valor = obtenerValor(id);

        productoAtributoRepository.delete(valor);

    }
}
