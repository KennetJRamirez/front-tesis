import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RepartidorService {
  private apiUrl = `${environment.apiUrl}/repartidor`;
  //private apiUrl = 'http://localhost:3000/repartidor';

  constructor(private http: HttpClient) {}

  // Perfil repartidor
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, data);
  }
  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/password`, data);
  }

  // Pedidos activos
  getPedidosActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/activos`);
  }

  // Historial de pedidos
  getHistorialPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/historial`);
  }

  // Detalle de un pedido
  getPedidoDetalle(id_envio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pedidos/${id_envio}`);
  }

  // Marcar como recolectado
  marcarRecolectado(id_envio: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${id_envio}/recolectado`, {});
  }

  // Marcar como entregado
  marcarEntregado(id_envio: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${id_envio}/entregado`, {});
  }

  // Guardar posición del repartidor
  savePosition(id_envio: number, lat: number, lng: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/tracking/${id_envio}`, {
      latitud: lat,
      longitud: lng,
    });
  }

  //  Obtener última posición de un envío
  getLastPosition(id_envio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tracking/${id_envio}`);
  }
  
  // Iniciar Recolecion
  iniciarRecoleccion(id_envio: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/pedidos/${id_envio}/iniciar-recoleccion`, {});
}

	// Inidicar entrega
iniciarEntrega(id_envio: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/pedidos/${id_envio}/iniciar-entrega`, {});
}

}
