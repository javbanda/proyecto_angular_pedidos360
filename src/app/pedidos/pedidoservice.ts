import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../interfaces/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  // private apiUrl = 'http://localhost:8080/api/pedidos';
  //private apiUrl = 'http://pedidos-api-env.eba-a97dmzri.us-east-1.elasticbeanstalk.com/api/pedidos'
  private apiUrl = 'https://8s8pz6vmm3.execute-api.us-east-1.amazonaws.com/prod/api/pedidos'
  obtenerPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  crearPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }
}