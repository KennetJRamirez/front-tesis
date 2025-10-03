import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  //private baseUrl = 'http://localhost:3000/usuario';
   private baseUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  updateProfile(data: {
    nombre: string;
    telefono: string;
    email: string;
  }): Observable<any> {
    return this.http.put(`${this.baseUrl}/me`, data);
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.put(`${this.baseUrl}/me/password`, data);
  }
}
