import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PedidoRequest,
  PedidoResponse,
} from '../pages/cliente/pedido/pedido.model';
import { Pedido } from '../pages/cliente/mis-pedidos/mis-pedidos.component';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  crearPedido(
    pedido: PedidoRequest,
    token: string
  ): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.baseUrl}/pedido`, pedido, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getMisPedidos(token: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedido/mios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
