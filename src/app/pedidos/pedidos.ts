import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidoService } from './pedidoservice';
import { Pedido } from '../interfaces/pedido.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {

  private pedidoService = inject(PedidoService);

  // Declaración de parámetros
  pedidos = signal<Pedido[]>([]); // Petición GET

  nuevoPedido = signal<Pedido>({
    cliente: '',
    detalle: '',
    total: 0
  });

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidoService.obtenerPedidos().subscribe({
      next: (data) => this.pedidos.set(data),
      error: (err) => console.error('Error al obtener los pedidos', err)
    });
  }

  guardarPedido(): void {
    this.pedidoService.crearPedido(this.nuevoPedido()).subscribe({
      next: (pedidoCreado) => {
        this.pedidos.update((lista) => [...lista, pedidoCreado]);
        this.nuevoPedido.set ({cliente: '', detalle: '', total: 0})
    },
     error: (err) => console.error('Error al crear el pedido:', err)
    });
  }
}