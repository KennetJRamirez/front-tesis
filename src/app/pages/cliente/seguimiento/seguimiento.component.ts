import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClienteService } from '../../../services/cliente.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css'],
})
export class SeguimientoComponent implements OnInit, AfterViewInit {
  id_envio!: number;
  position: any = null;
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.id_envio = Number(this.route.snapshot.paramMap.get('id_envio'));
  }

  ngAfterViewInit(): void {
    this.cargarUltimaPosicion();

    // Actualización automática cada 10 minutos
    setInterval(() => {
      this.actualizarPosicion();
    }, 600000);
  }

  cargarUltimaPosicion(): void {
    this.clienteService.getLastPosition(this.id_envio).subscribe({
      next: (pos: any) => {
        if (!pos) return;
        this.position = pos;
        const lat = Number(pos.latitud);
        const lng = Number(pos.longitud);

        if (isNaN(lat) || isNaN(lng)) {
          console.error('Coordenadas inválidas:', pos);
          return;
        }

        // Asegurarnos de que el div ya tenga tamaño
        setTimeout(() => {
          if (
            this.mapContainer &&
            this.mapContainer.nativeElement.offsetHeight > 0
          ) {
            this.initMap(lat, lng);
          }
        }, 100);
      },
      error: (err: any) => console.error('Error obteniendo posición', err),
    });
  }

initMap(lat: number, lng: number): void {
  if (this.map) {
    this.map.flyTo({ center: [lng, lat], zoom: 16 }); //  zoom
    return;
  }

  this.map = new mapboxgl.Map({
    accessToken: environment.mapboxToken,
    container: this.mapContainer.nativeElement,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: 16, // 🔥 más cerca
  });

  this.marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat([lng, lat])
    .addTo(this.map);

  this.map.on('load', () => {
    this.map.fitBounds([[lng, lat], [lng, lat]], {
      padding: 100,
      maxZoom: 18,
      duration: 0,
    });
  });
}

actualizarPosicion(): void {
  this.clienteService.getLastPosition(this.id_envio).subscribe({
    next: (pos: any) => {
      if (!pos) return;

      this.position = pos;
      const lat = Number(pos.latitud);
      const lng = Number(pos.longitud);

      if (!this.marker) {
        this.marker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([lng, lat])
          .addTo(this.map);
      } else {
        this.marker.setLngLat([lng, lat]);
      }

      if (this.map) {
        this.map.flyTo({
          center: [lng, lat],
          zoom: 16,
          speed: 0.8,
          curve: 1.2,
          essential: true,
        });
      }
    },
    error: (err: any) => console.error('Error actualizando posición', err),
  });
}
};
