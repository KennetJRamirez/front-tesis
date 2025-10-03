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

interface Zona {
  municipio: string;
  zona: number;
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

editUser(user: User) {
  Swal.fire({
    title: `Editar Usuario: ${user.nombre}`,
    html: `
      <input type="text" id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${user.nombre}">
      <input type="email" id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
      <input type="tel" id="swal-telefono" class="swal2-input" placeholder="Teléfono" value="${user.telefono}">
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim();
      const email = (document.getElementById('swal-email') as HTMLInputElement).value.trim();
      const telefono = (document.getElementById('swal-telefono') as HTMLInputElement).value.trim();

      if (!nombre) {
        Swal.showValidationMessage('El nombre es obligatorio');
        return false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.showValidationMessage('Email inválido');
        return false;
      }

      return { nombre, email, telefono };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const { nombre, email, telefono } = result.value;
      this.adminService.updateUser(user.id, { nombre, email, telefono }).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success');
          this.loadUsers();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el usuario', 'error'),
      });
    }
  });
}


editZonas(user: User) {
  if (user.rol !== 2) {
    Swal.fire('Info', 'Solo los repartidores pueden tener zonas asignadas', 'info');
    return;
  }

  // Obtener zonas del repartidor
  this.adminService.getRepartidorZonas(user.id).subscribe({
    next: (zonas: Zona[]) => {
      const renderModal = () => {
        Swal.fire({
          title: `Zonas de ${user.nombre}`,
          html: `
            <div id="zonas-list" style="text-align:left; margin-bottom: 1rem;">
              ${zonas.length ? zonas.map((z, i) => `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                  <span>${z.municipio} - Zona ${z.zona}</span>
                  <button type="button" class="swal2-confirm swal2-styled remove-btn" data-index="${i}" style="background:red; margin-left:10px;">Eliminar</button>
                </div>
              `).join('') : '<p>No tiene zonas asignadas</p>'}
            </div>
            <hr>
            <input type="text" id="swal-municipio" class="swal2-input" placeholder="Nuevo Municipio">
            <input type="number" id="swal-zona" class="swal2-input" placeholder="Número de zona">
          `,
          showCancelButton: true,
          confirmButtonText: 'Agregar zona',
          cancelButtonText: 'Cerrar',
          didOpen: () => {
            // Asignar eventos a botones de eliminar
            const removeButtons = document.querySelectorAll<HTMLButtonElement>('.remove-btn');
            removeButtons.forEach(btn => {
              btn.addEventListener('click', () => {
				const index = Number(btn.dataset["index"]);
                const z = zonas[index];
                this.adminService.removeZona(user.id, z.municipio, z.zona).subscribe({
                  next: () => {
                    Swal.fire('Eliminado', `Zona ${z.zona} de ${z.municipio} removida`, 'success');
                    zonas.splice(index, 1);
                    renderModal(); // Recargar modal
                  },
                  error: () => Swal.fire('Error', 'No se pudo quitar la zona', 'error')
                });
              });
            });
          },
          preConfirm: () => {
            const municipio = (document.getElementById('swal-municipio') as HTMLInputElement).value.trim();
            const zona = Number((document.getElementById('swal-zona') as HTMLInputElement).value);
            if (!municipio) {
              Swal.showValidationMessage('El municipio es obligatorio');
              return false;
            }
            if (!zona || zona < 1) {
              Swal.showValidationMessage('Zona inválida');
              return false;
            }
            return { municipio, zona };
          }
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const { municipio, zona } = result.value;
            this.adminService.assignZona(user.id, municipio, zona).subscribe({
              next: () => {
                Swal.fire('Agregado', `Zona ${zona} de ${municipio} asignada`, 'success');
                zonas.push({ municipio, zona });
                renderModal(); // Recargar modal
              },
              error: (err) => Swal.fire('Error', err.error?.error || 'No se pudo asignar la zona', 'error')
            });
          }
        });
      };
      renderModal();
    },
    error: () => Swal.fire('Error', 'No se pudieron cargar las zonas', 'error')
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
