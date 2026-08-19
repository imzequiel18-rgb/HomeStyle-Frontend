import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Marca { id?: number; nombre: string; descripcion?: string; logo?: string; activo: boolean; }
export interface Atributo { id?: number; nombre: string; tipoDato: string; unidad?: string; activo: boolean; }
export interface CategoriaAtributo { id?: number; categoriaId: number; categoriaNombre?: string; atributoId: number; atributoNombre?: string; obligatorio: boolean; orden: number; tipoDato?: string; unidad?: string; }

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly apiUrl = 'https://homestyle-backend-production.up.railway.app/api';
  constructor(private http: HttpClient) {}
  marcas(): Observable<Marca[]> { return this.http.get<Marca[]>(`${this.apiUrl}/marcas`, { headers: this.headers() }); }
  crearMarca(item: Marca): Observable<Marca> { return this.http.post<Marca>(`${this.apiUrl}/marcas`, item, { headers: this.headers() }); }
  actualizarMarca(id: number, item: Marca): Observable<Marca> { return this.http.put<Marca>(`${this.apiUrl}/marcas/${id}`, item, { headers: this.headers() }); }
  eliminarMarca(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/marcas/${id}`, { headers: this.headers() }); }
  atributos(): Observable<Atributo[]> { return this.http.get<Atributo[]>(`${this.apiUrl}/atributos`, { headers: this.headers() }); }
  crearAtributo(item: Atributo): Observable<Atributo> { return this.http.post<Atributo>(`${this.apiUrl}/atributos`, item, { headers: this.headers() }); }
  eliminarAtributo(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/atributos/${id}`, { headers: this.headers() }); }
  relaciones(): Observable<CategoriaAtributo[]> { return this.http.get<CategoriaAtributo[]>(`${this.apiUrl}/categoria-atributos`, { headers: this.headers() }); }
  crearRelacion(item: CategoriaAtributo): Observable<CategoriaAtributo> { return this.http.post<CategoriaAtributo>(`${this.apiUrl}/categoria-atributos`, item, { headers: this.headers() }); }
  eliminarRelacion(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/categoria-atributos/${id}`, { headers: this.headers() }); }
  private headers(): HttpHeaders { const token = localStorage.getItem('token'); return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders(); }
}
