import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { RepartidorService } from '../../../services/repartidor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-activos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatGridListModule,
  ],
  templateUrl: './pedidos-activos.component.html',
  styleUrls: ['./pedidos-activos.component.css'],
})
export class PedidosActivosComponent implements OnInit {
  pedidos: any[] = [];

  // Cada id_envio tiene su propio tracking
  trackingData: {
    [id_envio: number]: { watchId: number; interval: any };
  } = {};

  constructor(private repartidorService: RepartidorService) {}

  ngOnInit() {
    this.cargarPedidos();
    this.restoreTrackingFromStorage(); // Recupera tracking activo al cargar la página
  }

  cargarPedidos() {
    this.repartidorService.getPedidosActivos().subscribe({
      next: (data) => {
        this.pedidos = data.map((p) => ({
          ...p,
          paquete: {
            descripcion: p.paquete,
            fragil: p.fragil,
            peso: p.peso,
            dimensiones: p.dimensiones,
          },
          direccion_origen: {
            calle_principal: p.origen_calle,
            numero: p.origen_numero,
            calle_secundaria: p.origen_secundaria,
            colonia_o_barrio: p.origen_colonia,
            zona: p.origen_zona,
            municipio: p.origen_municipio,
            departamento: p.origen_departamento,
            codigo_postal: p.origen_cp,
          },
          direccion_destino: {
            calle_principal: p.destino_calle,
            numero: p.destino_numero,
            calle_secundaria: p.destino_destino,
            colonia_o_barrio: p.destino_colonia,
            zona: p.destino_zona,
            municipio: p.destino_municipio,
            departamento: p.destino_departamento,
            codigo_postal: p.destino_cp,
          },
          destinatario: {
            nombre: p.nombre_destinatario,
            telefono: p.telefono_destinatario,
            email: p.email_destinatario,
          },
        }));
      },
      error: (err) => console.error(err),
    });
  }

  // ===================== TRACKING =====================

  startTracking(id_envio: number) {
    if (!navigator.geolocation) {
      console.error('Geolocalización no soportada');
      return;
    }

    if (this.trackingData[id_envio]) {
      console.log(`⚠Ya hay tracking activo para el pedido ${id_envio}`);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.repartidorService.savePosition(id_envio, pos.coords.latitude, pos.coords.longitude).subscribe();
      },
      (err) => console.error('Error en geolocalización:', err),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.repartidorService.savePosition(id_envio, pos.coords.latitude, pos.coords.longitude).subscribe();
        },
        (err) => console.error('Error en geolocalización (interval):', err),
        { enableHighAccuracy: true }
      );
    }, 30000);

    this.trackingData[id_envio] = { watchId, interval };
    this.saveTrackingToStorage();
    console.log(`Tracking iniciado para pedido ${id_envio}`);
  }

  stopTracking(id_envio: number) {
    const tracking = this.trackingData[id_envio];
    if (tracking) {
      navigator.geolocation.clearWatch(tracking.watchId);
      clearInterval(tracking.interval);
      delete this.trackingData[id_envio];
      this.saveTrackingToStorage();
      console.log(`Tracking detenido para pedido ${id_envio}`);
    }
  }

  // ===================== LOCALSTORAGE =====================

  saveTrackingToStorage() {
    const activeIds = Object.keys(this.trackingData).map((id) => Number(id));
    localStorage.setItem('trackingPedidos', JSON.stringify(activeIds));
  }

  restoreTrackingFromStorage() {
    const saved = localStorage.getItem('trackingPedidos');
    if (saved) {
      const ids: number[] = JSON.parse(saved);
      ids.forEach((id_envio) => this.startTracking(id_envio));
    }
  }

  // ===================== ESTADOS =====================

  iniciarRecoleccion(id_envio: number) {
    this.repartidorService.iniciarRecoleccion(id_envio).subscribe(() => {
      this.startTracking(id_envio);
      Swal.fire('Tracking', 'Se inició la recolección y se notificó al cliente.', 'info');
      this.cargarPedidos();
    });
  }

  marcarRecolectado(id_envio: number) {
    this.stopTracking(id_envio);
    this.repartidorService.marcarRecolectado(id_envio).subscribe(() => {
      Swal.fire('Éxito', 'Pedido marcado como Recolectado', 'success');
      this.cargarPedidos();
    });
  }

  iniciarEntrega(id_envio: number) {
    this.startTracking(id_envio);
    this.repartidorService.iniciarEntrega(id_envio).subscribe(() => {
      Swal.fire('Tracking', 'Se inició la entrega y se notificó al destinatario.', 'info');
      this.cargarPedidos();
    });
  }

  marcarEntregado(id_envio: number) {
    this.stopTracking(id_envio);
    this.repartidorService.marcarEntregado(id_envio).subscribe(() => {
      Swal.fire('Éxito', 'Pedido marcado como Entregado', 'success');
      this.cargarPedidos();
    });
  }
}
