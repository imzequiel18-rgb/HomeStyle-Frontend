import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  constructor(private router: Router) {}
  cerrarSesion(): void { ['usuarioId', 'usuarioEmail', 'rol', 'token'].forEach((key) => localStorage.removeItem(key)); this.router.navigate(['/login']); }
}
