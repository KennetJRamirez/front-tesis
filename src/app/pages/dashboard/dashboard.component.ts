import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
  ],
})
export class DashboardComponent implements OnInit {
  userRole: number | null = null;
  userData: any = null;
  sidebarOpened: boolean = true;
  isScreenSmall: boolean = false;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userRole = this.auth.getUserRole();
    if (!this.userRole) return;

    this.usuarioService.getProfile().subscribe({
      next: (data) => (this.userData = data),
      error: (err) => console.error('Error cargando perfil:', err),
    });

    this.checkScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isScreenSmall = window.innerWidth < 768;
    this.sidebarOpened = !this.isScreenSmall;
  }

  logout() {
    Swal.fire({
      title: '¿Quieres cerrar sesión?',
      text: 'Tu sesión se cerrará',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout().subscribe({
          next: () => {
            this.auth.deleteToken();
            Swal.fire({
              icon: 'success',
              title: 'Sesión cerrada',
              showConfirmButton: false,
              timer: 1200,
            });
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error al hacer logout:', err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo cerrar sesión',
            });
          },
        });
      }
    });
  }
}
