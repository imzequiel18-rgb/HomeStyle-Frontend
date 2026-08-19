package registro_usuarios.dto;

public class ProductoAdminDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Double precioVenta;
    private Double dimensiones;
    private Double peso;
    private Integer stock;
    private String imagenUrl;
    private Double precioCosto;
    private String ubicacionBodega;

    public ProductoAdminDTO(){}

    public ProductoAdminDTO(Long id, String nombre, String descripcion,
                            Double precioVenta, Double dimensiones,
                            Double peso, Integer stock, String imagenUrl, Double precioCosto,
                            String ubicacionBodega) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioVenta = precioVenta;
        this.dimensiones = dimensiones;
        this.peso = peso;
        this.stock = stock;
        this.imagenUrl = imagenUrl;
        this.precioCosto = precioCosto;
        this.ubicacionBodega = ubicacionBodega;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(Double precioVenta) {
        this.precioVenta = precioVenta;
    }

    public Double getDimensiones() {
        return dimensiones;
    }

    public void setDimensiones(Double dimensiones) {
        this.dimensiones = dimensiones;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Double getPrecioCosto() {
        return precioCosto;
    }

    public void setPrecioCosto(Double precioCosto) {
        this.precioCosto = precioCosto;
    }

    public String getUbicacionBodega() {
        return ubicacionBodega;
    }

    public void setUbicacionBodega(String ubicacionBodega) {
        this.ubicacionBodega = ubicacionBodega;
    }
}
