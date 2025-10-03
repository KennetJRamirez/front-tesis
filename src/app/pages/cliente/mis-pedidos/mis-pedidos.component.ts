import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';
import { environment } from '../../../../environments/environment';

export interface Pedido {
  id_pedido: number;
  id_envio: number;
  estado: string;
  costo: number;
  fecha_asignacion: string;
  paquete: string;
  origen: string;
  destino: string;
}

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['./mis-pedidos.component.css'],
})
export class MisPedidosComponent implements OnInit, AfterViewInit {
  pedidos = new MatTableDataSource<Pedido>([]);
  displayedColumns: string[] = [
    'id_pedido',
    'paquete',
    'origen',
    'destino',
    'estado',
    'costo',
    'fecha_asignacion',
    'seguimiento',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pedidoService: PedidoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  ngAfterViewInit() {
    this.pedidos.paginator = this.paginator;
  }

  cargarPedidos() {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      Swal.fire('Error', 'No se encontró token de autenticación', 'error');
      return;
    }

    this.pedidoService.getMisPedidos(token).subscribe({
      next: (res: Pedido[]) => {
        this.pedidos.data = res;
      },
      error: (err: any) => {
        console.error(err);
        Swal.fire(
          'Error',
          err.error?.error || 'No se pudieron cargar tus pedidos',
          'error'
        );
      },
    });
  }

  verSeguimiento(id_envio: number) {
    this.router.navigate([`/dashboard/seguimiento/${id_envio}`]);
  }
}
