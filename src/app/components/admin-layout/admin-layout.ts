import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true, imports: [AdminSidebar, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void { if (localStorage.getItem('rol') !== 'ADMIN') this.router.navigate(['/login']); }

}
