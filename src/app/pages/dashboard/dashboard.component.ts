import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { PerfilComponent } from '../perfil/perfil.component';

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
    PerfilComponent,
  ],
})
export class DashboardComponent implements OnInit {
  userRole: number | null = null;
  userData: any = null;
  activeContent: 'perfilMiCuenta' | 'perfilPassword' | 'productos' | '' = '';
  sidebarOpened: boolean = true;
  isScreenSmall: boolean = false;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService
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

  setContent(section: 'perfilMiCuenta' | 'perfilPassword' | 'productos' | '') {
    this.activeContent = section;
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
