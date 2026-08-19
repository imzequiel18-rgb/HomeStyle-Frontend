import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaAtributo } from './catalogo';

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  activo?: boolean;
}
@Injectable({ providedIn: 'root' })
export class CategoriaService {

  private readonly apiUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl, { headers: this.headers() });
  }

  obtenerAtributosCategoria(categoriaId: number): Observable<CategoriaAtributo[]> {
    return this.http.get<CategoriaAtributo[]>(
      `http://localhost:8080/api/categoria-atributos/categoria/${categoriaId}`,
      { headers: this.headers() },
    );
  }
  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria, { headers: this.headers() });
  }

  actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria, { headers: this.headers() });
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
  
}
