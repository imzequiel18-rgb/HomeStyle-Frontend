import { Component, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id?: number;
  idUsuario?: number;
  email: string;
  user: string;
  phoneNumber?: string;
}

@Component({
  selector: 'app-usuarios',  
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
})
export class UsuariosComponent implements OnInit {

  usuarios = signal<Usuario[]>([]);
  cargando = signal(false);
  error = signal('');

  constructor(private usuarioService: UsuarioService) {} 

  ngOnInit(): void {
    console.log("COMPONENTE CARGADO");

    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.cargando.set(true);
    this.error.set('');

    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => {
        console.log('Usuarios recibidos:', data);
        const usuarios = Array.isArray(data) ? data : data?.usuarios ?? data?.content ?? [];
        this.usuarios.set(usuarios.map((usuario: any) => ({
          id: usuario.id ?? usuario.Id,
          idUsuario: usuario.idUsuario,
          email: usuario.email ?? usuario.correo ?? '',
          user: usuario.user ?? usuario.nombre ?? '',
          phoneNumber: usuario.phoneNumber ?? usuario.telefono ?? '',
        })));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.error.set('No se pudieron cargar los usuarios.');
        this.cargando.set(false);
      },
    });
  }
}
