import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidoService } from './pedidoservice';

import {
  Pedido,
  CrearPedidoRequest
} from '../interfaces/pedido.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {

  private pedidoService = inject(PedidoService);

  // Lista de pedidos obtenidos desde Orders
  pedidos = signal<Pedido[]>([]);

  // Datos del formulario para crear un pedido
  nuevoPedido = signal<CrearPedidoRequest>({
    clienteId: 0,
    sucursalId: 0,
    detalles: [
      {
        productoId: 0,
        cantidad: 1
      }
    ]
  });

  ngOnInit(): void {
    this.cargarPedidos();
  }

  // Obtener pedidos desde API Gateway
  cargarPedidos(): void {
    this.pedidoService.obtenerPedidos().subscribe({
      next: (data) => {
        this.pedidos.set(data);
      },
      error: (err) => {
        console.error('Error al obtener los pedidos:', err);
      }
    });
  }

  // Crear pedido en Spring Boot
  guardarPedido(): void {
    this.pedidoService.crearPedido(this.nuevoPedido()).subscribe({
      next: (pedidoCreado) => {

        this.pedidos.update((lista) => [...lista, pedidoCreado]);

        // Limpiar formulario
        this.nuevoPedido.set({
          clienteId: 0,
          sucursalId: 0,
          detalles: [
            {
              productoId: 0,
              cantidad: 1
            }
          ]
        });
      },
      error: (err) => {
        console.error('Error al crear el pedido:', err);
      }
    });
  }
}