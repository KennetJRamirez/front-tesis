import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  // ---- Usuarios ----
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios`, this.getAuthHeaders());
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/usuarios/${id}`,
      this.getAuthHeaders()
    );
  }

  changeUserRole(id: number, id_rol: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/usuarios/${id}/rol`,
      { id_rol },
      this.getAuthHeaders()
    );
  }

  changeUserState(id: number, activo: boolean): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/usuarios/${id}/estado`,
      { activo },
      this.getAuthHeaders()
    );
  }

  // ---- Reportes ----
  getPedidosPorEstado(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/reportes/pedidos-estado`,
      this.getAuthHeaders()
    );
  }

  getIngresosPorDia(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/reportes/ingresos-dia`,
      this.getAuthHeaders()
    );
  }

  getPedidosPorZona(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/reportes/pedidos-zona`,
      this.getAuthHeaders()
    );
  }

  getEntregasPorRepartidor(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/reportes/entregas-repartidor`,
      this.getAuthHeaders()
    );
  }
}
