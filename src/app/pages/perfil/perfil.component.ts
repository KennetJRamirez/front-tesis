import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [
    MatToolbarModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class PerfilComponent implements OnInit {
  @Input() showSection: 'miCuenta' | 'cambiarPassword' = 'miCuenta';
  @Input() usuario: any = null;

  perfilForm?: FormGroup;
  passwordForm?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // Si el input usuario no llega, lo cargamos
    if (!this.usuario) {
      this.usuarioService.getProfile().subscribe({
        next: (data) => {
          this.usuario = data;
          this.initForms();
        },
        error: (err) => console.error('Error cargando perfil:', err),
      });
    } else {
      this.initForms();
    }
  }

  initForms() {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre || '', Validators.required],
      telefono: [this.usuario?.telefono || '', Validators.required],
      email: [
        this.usuario?.email || '',
        [Validators.required, Validators.email],
      ],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  guardarCambios() {
    if (this.perfilForm?.valid) {
      this.usuarioService.updateProfile(this.perfilForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado',
            text: '¡Tus datos se han guardado correctamente!',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el perfil',
          });
        },
      });
    }
  }

  cambiarPassword() {
    if (this.passwordForm?.valid) {
      this.usuarioService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña cambiada',
            text: 'Tu nueva contraseña ha sido guardada correctamente',
            timer: 2000,
            showConfirmButton: false,
          });
          this.passwordForm?.reset();
        },
        error: (err) => {
          console.error('Error al cambiar contraseña:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cambiar la contraseña',
          });
        },
      });
    }
  }
}
