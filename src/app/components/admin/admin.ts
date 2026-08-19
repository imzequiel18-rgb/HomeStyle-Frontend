import { Component } from '@angular/core';
import { AdminLayout } from '../admin-layout/admin-layout';

/** Contenedor compatible con la ruta antigua; la lógica vive en los módulos hijos. */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminLayout],
  template: '<app-admin-layout />',
})
export class AdminComponent {}
