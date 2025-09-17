import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RepartidorService } from '../../../services/repartidor.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [
    MatChipsModule,
    MatInputModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatFormField,
    MatLabel,
  ],
  templateUrl: './historial-pedidos.component.html',
})
export class HistorialPedidosComponent implements OnInit {
  displayedColumns = [
    'id_envio',
    'paquete',
    'fragil',
    'origen',
    'destino',
    'fecha',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private repartidorService: RepartidorService) {}

  ngOnInit() {
    this.repartidorService.getHistorialPedidos().subscribe({
      next: (data) => {
        const pedidos = data.map((p) => ({
          ...p,
          paquete: p.paquete,
          origen: `${p.origen_calle} ${p.origen_numero}, ${p.origen_secundaria}, ${p.origen_colonia}, Zona ${p.origen_zona}, ${p.origen_municipio}, ${p.origen_departamento}, C.P. ${p.origen_cp}`,
          destino: `${p.destino_calle} ${p.destino_numero}, ${p.destino_secundaria}, ${p.destino_colonia}, Zona ${p.destino_zona}, ${p.destino_municipio}, ${p.destino_departamento}, C.P. ${p.destino_cp}`,
          fragil: p.fragil,
        }));

        this.dataSource.data = pedidos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error(err),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
