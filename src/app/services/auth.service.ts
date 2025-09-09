import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RegisterData {
  nombre: string;
  telefono: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    this.deleteCookie('token');
    this.deleteCookie('rol');
    return this.http.post(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }

  // ---------------- Cookies ----------------
  saveToken(token: string, rol: number) {
    this.setCookie('token', token);
    this.setCookie('rol', rol.toString());
  }

  getToken(): string | null {
    return this.getCookie('token');
  }

  getUserRole(): number | null {
    const rol = this.getCookie('rol');
    return rol ? parseInt(rol, 10) : null;
  }

  private setCookie(name: string, value: string, days = 1) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }

  private deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }
}
