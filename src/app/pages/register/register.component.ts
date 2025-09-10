import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatDividerModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

onSubmit() {
  if (this.registerForm.invalid) {
    const errors = [];
    if (this.nombre?.invalid) errors.push('Nombre inválido (mín. 3 caracteres)');
    if (this.telefono?.invalid) errors.push('Teléfono inválido (8 dígitos)');
    if (this.email?.invalid) errors.push('Email inválido');
    if (this.password?.invalid) errors.push('Contraseña inválida (mín. 8 caracteres)');

    Swal.fire({
      icon: 'error',
      title: 'Formulario inválido',
      html: errors.join('<br>'),
    });
    return;
  }

  const registerData = this.registerForm.getRawValue() as {
    nombre: string;
    telefono: string;
    email: string;
    password: string;
  };

  this.authService.register(registerData).pipe(
    catchError((err) => {
      console.error('Error al registrar:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar el usuario 😅',
      });
      return of(null);
    })
  ).subscribe((res) => {
    if (res) {
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión',
        showConfirmButton: false,
        timer: 1200
      }).then(() => this.router.navigate(['/login']));
    }
  });
}


  get nombre() {
    return this.registerForm.get('nombre');
  }
  get telefono() {
    return this.registerForm.get('telefono');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
}
