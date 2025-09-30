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
  trackingId: number | null = null;   // para watchPosition
  trackingInterval: any = null;       // fallback con setInterval

  constructor(private repartidorService: RepartidorService) {}

  ngOnInit() {
    this.cargarPedidos();
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
            calle_secundaria: p.destino_secundaria,
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

    // watchPosition (cambios inmediatos)
    this.trackingId = navigator.geolocation.watchPosition(
      (pos) => {
        this.repartidorService.savePosition(id_envio, pos.coords.latitude, pos.coords.longitude).subscribe();
      },
      (err) => console.error('Error en geolocalización:', err),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    // Fallback cada 30s (por si watchPosition no actualiza)
    this.trackingInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.repartidorService.savePosition(id_envio, pos.coords.latitude, pos.coords.longitude).subscribe();
        },
        (err) => console.error('Error en geolocalización (interval):', err),
        { enableHighAccuracy: true }
      );
    }, 30000);

    console.log('✅ Tracking iniciado');
  }

  stopTracking() {
    if (this.trackingId !== null) {
      navigator.geolocation.clearWatch(this.trackingId);
      this.trackingId = null;
    }
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    console.log('🛑 Tracking detenido');
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
  this.stopTracking();
  this.repartidorService.marcarRecolectado(id_envio).subscribe(() => {
    Swal.fire('Éxito', 'Pedido marcado como Recolectado', 'success');
    this.cargarPedidos();
  });
}

iniciarEntrega(id_envio: number) {
  this.repartidorService.iniciarEntrega(id_envio).subscribe(() => {
    this.startTracking(id_envio);
    Swal.fire('Tracking', 'Se inició la entrega y se notificó al destinatario.', 'info');
    this.cargarPedidos();
  });
}

marcarEntregado(id_envio: number) {
  this.stopTracking();
  this.repartidorService.marcarEntregado(id_envio).subscribe(() => {
    Swal.fire('Éxito', 'Pedido marcado como Entregado', 'success');
    this.cargarPedidos();
  });
}
}
