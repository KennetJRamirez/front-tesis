// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Dashboard</h2>
      <p>Bienvenido, rol: {{ userRole }}</p>

      <!-- Funciones por rol -->
      <div *ngIf="userRole === 3">
        <button mat-raised-button color="primary">Crear Paquete</button>
        <button mat-raised-button color="accent">Gestionar Usuarios</button>
      </div>

      <div *ngIf="userRole === 2">
        <button mat-raised-button color="primary">Ver Mis Entregas</button>
      </div>

      <div *ngIf="userRole === 1">
        <button mat-raised-button color="primary">Ver Productos</button>
      </div>

      <button mat-stroked-button color="warn" (click)="logout()">
        Cerrar sesión
      </button>
    </mat-card>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userRole: number | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.userRole = this.auth.getUserRole();
    if (!this.userRole) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
