import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  rol: number;
}

interface RegisterData {
  nombre: string;
  telefono: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, data)
      .pipe(tap((res) => this.saveToken(res.token, res.rol)));
  }

  // REGISTRO
  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // LOGOUT
  logout(): Observable<any> {
    this.deleteToken();
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  // ---------------- Token ----------------
  saveToken(token: string, rol: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol.toString());
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): number | null {
    const rol = localStorage.getItem('rol');
    return rol ? parseInt(rol, 10) : null;
  }

  deleteToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}
