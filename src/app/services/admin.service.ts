import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


interface Zona {
  municipio: string;
  zona: number;
}


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

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

  updateUser(id: number, data: { nombre: string; email: string; telefono: string }) {
	 return this.http.put(`${this.baseUrl}/usuarios/${id}`, data, this.getAuthHeaders());
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
  
  // ---- Zonas de repartidor ----
  getRepartidorZonas(id: number): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${this.baseUrl}/usuarios/${id}/zonas`, this.getAuthHeaders());
  }

  assignZona(id: number, municipio: string, zona: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/${id}/zonas`, { municipio, zona }, this.getAuthHeaders());
  }

  removeZona(id: number, municipio: string, zona: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}/zonas`, {
      ...this.getAuthHeaders(),
      body: { municipio, zona },
    });
  }
}
