import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Pedido,
  CrearPedidoRequest
} from '../interfaces/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private http = inject(HttpClient);

  private apiUrl =
    'https://ha9pj655yl.execute-api.us-east-1.amazonaws.com/api/orders';

  // Obtener todos los pedidos
  obtenerPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  // Crear un pedido
  crearPedido(pedido: CrearPedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }
}