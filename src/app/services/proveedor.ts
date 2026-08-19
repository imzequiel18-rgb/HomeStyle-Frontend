import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Proveedor {
  id?: number;
  nombre: string;
  correo: string;
  telefono: string;
}

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private readonly apiUrl = 'http://localhost:8080/api/proveedores';

  constructor(private http: HttpClient) {}

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor, { headers: this.getHeaders() });
  }

  actualizarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor, { headers: this.getHeaders() });
  }

  eliminarProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
