import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoRequest, PedidoResponse } from '../pages/cliente/pedido/pedido.model';
import { Pedido } from '../pages/cliente/mis-pedidos/mis-pedidos.component';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Crear pedido real
  crearPedido(pedido: PedidoRequest, token: string): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.baseUrl}/pedido`, pedido, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Obtener pedidos del usuario
  getMisPedidos(token: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedido/mios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Calcular costo sin crear pedido
  calcularCosto(pedido: PedidoRequest, token: string): Observable<{ costo: number; km_destino: number }> {
    return this.http.post<{ costo: number; km_destino: number }>(
      `${this.baseUrl}/pedido/calcular`,
      pedido,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
