import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { PedidoService } from '../../../services/pedido.service';
import {
  PedidoRequest,
  PedidoResponse,
  Paquete,
  Direccion,
  Destinatario,
} from './pedido.model';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
})
export class PedidoComponent implements OnInit {
  token = localStorage.getItem('token') || '';

  paqueteForm!: FormGroup;
  origenForm!: FormGroup;
  destinoForm!: FormGroup;
  destinatarioForm!: FormGroup;

  constructor(private fb: FormBuilder, private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    this.paqueteForm = this.fb.group({
      descripcion: ['', Validators.required],
      peso: [0, [Validators.required, Validators.min(0.1)]],
      dimensiones: ['', Validators.required],
      fragil: [false],
    });

    const direccionGroup = {
      calle_principal: ['', Validators.required],
      numero: ['', Validators.required],
      calle_secundaria: [''],
      zona: ['', Validators.required],
      colonia_o_barrio: ['', Validators.required],
      municipio: ['', Validators.required],
      departamento: ['', Validators.required],
      codigo_postal: ['', Validators.required],
      referencias: [''],
    };

    this.origenForm = this.fb.group(direccionGroup);
    this.destinoForm = this.fb.group(direccionGroup);

    this.destinatarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
    });
  }

  enviarPedido() {
    if (!this.token) {
      Swal.fire('Error', 'No se encontró token de autenticación', 'error');
      return;
    }

    const pedidoData: PedidoRequest = {
      paquete: this.paqueteForm.value as Paquete,
      direccion_origen: this.origenForm.value as Direccion,
      direccion_destino: this.destinoForm.value as Direccion,
      destinatario: this.destinatarioForm.value as Destinatario,
    };

    // Paso 1: Hacemos el "pre-check" para obtener costo antes de crear
    this.pedidoService.crearPedido(pedidoData, this.token).subscribe({
      next: (res: PedidoResponse) => {
        // Mostrar confirmación con costo
        Swal.fire({
          title: 'Costo de la orden',
          text: `Q${res.costo.toFixed(2)}. ¿Deseas confirmar el pedido?`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Confirmado → enviamos el pedido real
            this.pedidoService.crearPedido(pedidoData, this.token).subscribe({
              next: (res: PedidoResponse) =>
                Swal.fire(
                  'Pedido creado 🎉',
                  `Costo: Q${res.costo.toFixed(2)}`,
                  'success'
                ),
              error: (err) =>
                Swal.fire(
                  'Error',
                  err.error?.error || 'No se pudo crear el pedido',
                  'error'
                ),
            });
          } else {
            // Cancelado → no hacemos nada
            Swal.fire('Cancelado', 'No se creó el pedido', 'info');
          }
        });
      },
      error: (err) =>
        Swal.fire('Error', 'No se pudo calcular el costo', 'error'),
    });
  }
}
