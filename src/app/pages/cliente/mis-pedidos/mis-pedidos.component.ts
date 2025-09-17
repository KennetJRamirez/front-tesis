import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { PedidoService } from '../../../services/pedido.service';
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
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule],
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['./mis-pedidos.component.css'],
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  displayedColumns: string[] = [
    'id_pedido',
    'paquete',
    'origen',
    'destino',
    'estado',
    'costo',
    'fecha_asignacion',
  ];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos() {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      Swal.fire('Error', 'No se encontró token de autenticación', 'error');
      return;
    }

    this.pedidoService.getMisPedidos(token).subscribe({
      next: (res) => {
        this.pedidos = res;
      },
      error: (err) => {
        console.error(err);
        Swal.fire(
          'Error',
          err.error?.error || 'No se pudieron cargar tus pedidos',
          'error'
        );
      },
    });
  }
}
