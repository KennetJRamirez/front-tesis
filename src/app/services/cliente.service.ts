import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // 🚚 Pedido normal (cliente autenticado)
  getLastPosition(id_envio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cliente/tracking/${id_envio}`);
  }

  // 👤 Invitado (guest con token)
  getLastPositionGuest(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cliente/guest/${token}`);
  }
}
