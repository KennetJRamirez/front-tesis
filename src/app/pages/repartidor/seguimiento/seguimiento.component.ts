import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepartidorService } from '../../../services/repartidor.service';
import * as L from 'leaflet';

// 👇 corregir path de íconos
const iconDefault = L.icon({
  iconUrl: 'assets/leaflet/images/marker-icon.png',
  shadowUrl: 'assets/leaflet/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-seguimiento',
  template: '<div id="map" style="height: 500px;"></div>',
  standalone: true,
})
export class SeguimientoComponent implements OnInit {
  id_envio!: number;
  map!: L.Map;
  marker!: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private repartidorService: RepartidorService
  ) {}

  ngOnInit() {
    this.id_envio = Number(this.route.snapshot.paramMap.get('id_envio'));
    this.initMap();
    this.loadPosition();
    setInterval(() => this.loadPosition(), 5000); // refresca cada 5s
  }

  initMap() {
    this.map = L.map('map').setView([14.6349, -90.5069], 13); // coordenadas iniciales
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  loadPosition() {
    this.repartidorService.getLastPosition(this.id_envio).subscribe({
      next: (pos: any) => {
        if (!pos) return;
        const latLng = L.latLng(pos.latitud, pos.longitud);
        if (!this.marker) {
          this.marker = L.marker(latLng).addTo(this.map);
          this.map.setView(latLng, 16);
        } else {
          this.marker.setLatLng(latLng);
          this.map.panTo(latLng);
        }
      },
      error: (err: any) => console.error(err),
    });
  }
}
