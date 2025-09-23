import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  constructor(private http: HttpClient) {}

getLastPosition(id_envio: number) {
  return this.http.get<any>(`http://localhost:3000/cliente/tracking/${id_envio}`);
}
}
