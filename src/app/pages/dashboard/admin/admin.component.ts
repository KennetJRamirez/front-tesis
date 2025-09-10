import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';

interface UserResponse {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  id_rol: number;
  activo: number;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: number;
  activo: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  displayedColumns: string[] = [
    'id',
    'nombre',
    'email',
    'rol',
    'activo',
    'acciones',
  ];

  dataSource = new MatTableDataSource<User>([]);
  searchKey: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    // Asignar paginador
    this.dataSource.paginator = this.paginator;

    // Filtro por nombre o email
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      return (
        data.nombre.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter)
      );
    };
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res: UserResponse[]) => {
        this.users = res.map((u: UserResponse) => ({
          id: u.id_usuario,
          nombre: u.nombre,
          email: u.email,
          telefono: u.telefono,
          rol: u.id_rol,
          activo: u.activo === 1,
        }));
        this.dataSource.data = this.users;
      },
      error: () =>
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error'),
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter() {
    this.searchKey = '';
    this.applyFilter();
  }

  viewUser(userId: number) {
    this.adminService.getUserById(userId).subscribe({
      next: (u: UserResponse) => {
        Swal.fire({
          title: `Usuario: ${u.nombre}`,
          html: `
            <p><strong>Email:</strong> ${u.email}</p>
            <p><strong>Teléfono:</strong> ${u.telefono}</p>
            <p><strong>Rol:</strong> ${this.getRoleName(u.id_rol)}</p>
            <p><strong>Activo:</strong> ${u.activo === 1 ? 'Sí' : 'No'}</p>
          `,
          icon: 'info',
        });
      },
      error: () => Swal.fire('Error', 'No se pudo cargar el usuario', 'error'),
    });
  }

  toggleActive(user: User) {
    this.adminService.changeUserState(user.id, !user.activo).subscribe({
      next: () => {
        Swal.fire(
          'Actualizado',
          `Usuario ${!user.activo ? 'activado' : 'desactivado'}`,
          'success'
        );
        this.loadUsers();
      },
      error: () => Swal.fire('Error', 'No se pudo cambiar el estado', 'error'),
    });
  }

  changeRole(user: User, id_rol: number) {
    this.adminService.changeUserRole(user.id, id_rol).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Rol cambiado correctamente', 'success');
        this.loadUsers();
      },
      error: () => Swal.fire('Error', 'No se pudo cambiar el rol', 'error'),
    });
  }

  getRoleName(rol: number): string {
    switch (rol) {
      case 1:
        return 'Cliente';
      case 2:
        return 'Repartidor';
      case 3:
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }
}
