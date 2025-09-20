import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RepartidorService } from '../../../services/repartidor.service';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css'],
})
export class SeguimientoComponent implements OnInit {
  id_envio!: number;
  position: any = null;

  constructor(
    private route: ActivatedRoute,
    private repartidorService: RepartidorService
  ) {}

  ngOnInit(): void {
    this.id_envio = Number(this.route.snapshot.paramMap.get('id_envio'));
    this.cargarUltimaPosicion();
  }

  cargarUltimaPosicion() {
    this.repartidorService.getLastPosition(this.id_envio).subscribe({
      next: (pos) => {
        this.position = pos;
        console.log('📍 Última posición:', pos);
      },
      error: (err) => console.error('Error obteniendo posición', err),
    });
  }
}
