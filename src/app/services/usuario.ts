import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerfilUsuario {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  rol: string;
}

export interface ActualizarPerfilRequest {
  userName: string;
  email: string;
  phoneNumber: string;
}

export interface CambiarPasswordRequest {
  passwordActual: string;
  passwordNueva: string;
  confirmarPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  obtenerUsuarios(): Observable<any> { 
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }  

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario, { headers: this.getHeaders() });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario, { headers: this.getHeaders() });
  }

  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  obtenerPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/perfil`, { headers: this.getHeaders() });
  }

  actualizarPerfil(perfil: ActualizarPerfilRequest): Observable<PerfilUsuario> {
    return this.http.put<PerfilUsuario>(`${this.apiUrl}/perfil`, perfil, {
      headers: this.getHeaders(),
    });
  }

  cambiarPassword(datos: CambiarPasswordRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/cambiar-password`, datos, {
      headers: this.getHeaders(),
      responseType: 'text',
    });
  }
}
