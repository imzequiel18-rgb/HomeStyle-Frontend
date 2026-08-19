import { Injectable } from '@angular/core';
import { Direccion } from './admin';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private api = 'https://homestyle-backend-production.up.railway.app/api/direcciones';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : new HttpHeaders();
  }

  obtenerDirecciones() {
    return this.http.get<Direccion[]>(this.api, {
      headers: this.getHeaders(),
    });
  }

  obtenerDireccion(id: number) {
    return this.http.get<Direccion>(`${this.api}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  crear(direccion: Direccion) {
    return this.http.post<Direccion>(this.api, direccion, {
      headers: this.getHeaders(),
    });
  }

  actualizar(id: number, direccion: Direccion) {
    return this.http.put<Direccion>(`${this.api}/${id}`, direccion, {
      headers: this.getHeaders(),
    });
  }

  eliminar(id: number) {
    return this.http.delete(`${this.api}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  establecerPredeterminada(id: number) {
    return this.http.put(
      `${this.api}/${id}/predeterminada`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }
}
