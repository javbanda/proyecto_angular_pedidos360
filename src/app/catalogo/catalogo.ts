
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagenUrl: string;
  activo: boolean;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {

  // Lista de productos obtenidos desde Spring Boot
  productos: Producto[] = [];

  // Estados de carga y error
  cargando = false;
  error = '';

  // Endpoint del microservicio de Catálogo
  private apiUrl = 'http://localhost:8083/api/catalog/productos';

  constructor(private http: HttpClient) {}

  // Se ejecuta al abrir la página de Catálogo
  ngOnInit(): void {
    this.cargarProductos();
  }

  // Consulta los productos registrados en PostgreSQL
  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (respuesta) => {
        this.productos = respuesta;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
    });
  }

  // Cuenta los productos que están activos
  get productosActivos(): number {
    return this.productos.filter(
      producto => producto.activo
    ).length;
  }

  // Cuenta los productos que están inactivos
  get productosInactivos(): number {
    return this.productos.filter(
      producto => !producto.activo
    ).length;
  }

}
