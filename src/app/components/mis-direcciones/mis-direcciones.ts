import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DireccionService } from '../../services/direccion';
import { Direccion } from '../../services/admin';

@Component({
  selector: 'app-mis-direcciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-direcciones.html',
  styleUrl: './mis-direcciones.css',
})
export class MisDireccionesComponent implements OnInit {

  direcciones = signal<Direccion[]>([]);

  cargando = signal(false);

  error = signal('');

  constructor(
    private direccionService: DireccionService
  ) {}

  ngOnInit(): void {
    this.cargarDirecciones();
  }

  cargarDirecciones() {

    this.cargando.set(true);

    this.direccionService.obtenerDirecciones().subscribe({

      next: (data) => {

        this.direcciones.set(data);

        this.cargando.set(false);

      },

      error: () => {

        this.error.set('No fue posible cargar las direcciones.');

        this.cargando.set(false);

      }

    });

  }

}