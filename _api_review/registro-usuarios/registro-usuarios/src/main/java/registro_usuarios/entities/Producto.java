package registro_usuarios.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false , length = 100)
    private String nombre;

    @Column(nullable = false , length = 100)
    private String descripcion;

    @Column(name = "precio_venta", nullable = false)
    private Double precioVenta;

    @Column(nullable = false)
    private Double dimensiones;

    @Column(nullable = false)
    private Double peso;

    @Column(nullable = false)
    private Integer stock;

    @Lob
    @Column(name = "imagen_url", columnDefinition = "LONGTEXT")
    private String imagenUrl;

    //datos sensibles para DTO
    @Column(name = "precio_costo", nullable = false)
    private Double precioCosto;

    @Column(name = "ubicacion_bodega", nullable = false , length = 100)
    private String ubicacionBodega;

    @ManyToOne // Muchos productos pertenecen a proveedors
    @JoinColumn(name = "proveedor_id", nullable = false) // Nombre de la FK en la tabla
    private Proveedor proveedor;

    @ManyToOne // Muchos productos pertenecen a proveedors
    @JoinColumn(name = "categoria_id", nullable = false) // Nombre de la FK en la tabla
    private Categoria categoria;

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    public Producto(){}

    public Producto(Double peso, String ubicacionBodega, Double precioCosto,
                    String imagenUrl, Integer stock, Double dimensiones,
                    Double precioVenta, String descripcion,
                    String nombre) {

        this.peso = peso;
        this.ubicacionBodega = ubicacionBodega;
        this.precioCosto = precioCosto;
        this.imagenUrl = imagenUrl;
        this.stock = stock;
        this.dimensiones = dimensiones;
        this.precioVenta = precioVenta;
        this.descripcion = descripcion;
        this.nombre = nombre;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public String getUbicacionBodega() {
        return ubicacionBodega;
    }

    public void setUbicacionBodega(String ubicacionBodega) {
        this.ubicacionBodega = ubicacionBodega;
    }

    public Double getPrecioCosto() {
        return precioCosto;
    }

    public void setPrecioCosto(Double precioCosto) {
        this.precioCosto = precioCosto;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Double getDimensiones() {
        return dimensiones;
    }

    public void setDimensiones(Double dimensiones) {
        this.dimensiones = dimensiones;
    }

    public Double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(Double precioVenta) {
        this.precioVenta = precioVenta;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
