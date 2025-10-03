import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { NgHcaptchaModule } from 'ng-hcaptcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    RouterModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgHcaptchaModule, 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  captchaToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    captcha: ['', Validators.required],
  });

  onVerify(token: string) {
    this.captchaToken = token;
    this.loginForm.patchValue({ captcha: token });
  }

  onExpired() {
    this.captchaToken = null;
    this.loginForm.patchValue({ captcha: '' });
  }

  onError(error: any) {
    console.error('hCaptcha error:', error);
    this.captchaToken = null;
    this.loginForm.patchValue({ captcha: '' });
  }

  onSubmit() {
    if (this.loginForm.invalid || !this.captchaToken) {
      const errors = [];
      if (this.email?.invalid) errors.push('Email inválido');
      if (this.password?.invalid) errors.push('Contraseña inválida');
      if (!this.captchaToken) errors.push('Captcha requerido');

      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        html: errors.join('<br>'),
      });
      return;
    }

    const loginData = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
      captcha: this.captchaToken || '',
    };

    this.authService
      .login(loginData)
      .pipe(
        catchError((err) => {
          console.error('Error al loguear:', err);
          Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'Por favor verifica tu email y contraseña',
          });
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.authService.saveToken(res.token, res.rol);
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: 'Has iniciado sesión correctamente',
            showConfirmButton: false,
            timer: 1200,
          }).then(() => this.router.navigate(['/dashboard']));
        }
      });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
