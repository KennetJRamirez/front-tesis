import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../../services/admin.service';

// Gráficos
Chart.register(...registerables);

// Interfaces para tipado de respuesta
interface PedidoEstado { estado: string; total: number; }
interface IngresoDia { fecha: string; ingresos: number; }
interface PedidoZona { municipio: string; zona: string; total: number; }
interface EntregaRepartidor { repartidor: string; entregados: number; }

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  templateUrl: './admin-reportes.component.html',
  styleUrls: ['./admin-reportes.component.css']
})
export class AdminReportesComponent implements OnInit {

  pedidosEstadoData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  ingresosData: ChartData<'line'> = { labels: [], datasets: [{ data: [], label: 'Ingresos' }] };
  pedidosZonaData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Pedidos' }] };
  entregasData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Entregas' }] };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPedidosPorEstado();
    this.loadIngresosPorDia();
    this.loadPedidosPorZona();
    this.loadEntregasPorRepartidor();
  }

loadPedidosPorEstado() {
  const estados = ['En tránsito', 'Entregado', 'Recolectado']; 
  this.adminService.getPedidosPorEstado().subscribe((res: PedidoEstado[]) => {
    this.pedidosEstadoData = {
      labels: estados,
      datasets: [{
        data: estados.map(e => {
          const encontrado = res.find(r => r.estado === e);
          return encontrado ? encontrado.total : 0;
        })
      }]
    };
  });
}

loadIngresosPorDia() {
  this.adminService.getIngresosPorDia().subscribe((res: IngresoDia[]) => {
    this.ingresosData = {
      labels: res.map(r => {
        const fecha = new Date(r.fecha);
        return `${fecha.getDate()}/${fecha.getMonth() + 1}`; 
      }),
      datasets: [{ data: res.map(r => r.ingresos), label: 'Ingresos' }]
    };
  });
}

  loadPedidosPorZona() {
    this.adminService.getPedidosPorZona().subscribe((res: PedidoZona[]) => {
      this.pedidosZonaData = {
        labels: res.map(r => `${r.municipio} - Zona ${r.zona}`),
        datasets: [{ data: res.map(r => r.total), label: 'Pedidos' }]
      };
    });
  }

  loadEntregasPorRepartidor() {
    this.adminService.getEntregasPorRepartidor().subscribe((res: EntregaRepartidor[]) => {
      this.entregasData = {
        labels: res.map(r => r.repartidor),
        datasets: [{ data: res.map(r => r.entregados), label: 'Entregas' }]
      };
    });
  }

}
