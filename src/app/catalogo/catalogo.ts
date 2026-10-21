
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

interface ProductoRequest {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagenUrl: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {

  // Productos obtenidos desde Spring Boot
  productos: Producto[] = [];

  // Estados de la interfaz
  cargando = false;
  guardando = false;
  error = '';
  mensaje = '';

  // Datos del formulario
  nuevoProducto: ProductoRequest = {
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    imagenUrl: ''
  };

  // Endpoint del microservicio de Catálogo
  private apiUrl = 'http://localhost:8083/api/catalog/productos';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  // Obtener productos desde Spring Boot
  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (respuesta) => {
        this.productos = respuesta;
        this.cargando = false;

        // Actualizar la tabla y los contadores
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);

        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;

        // Mostrar el mensaje de error
        this.cdr.detectChanges();
      }
    });
  }

  // Registrar un producto en PostgreSQL mediante Spring Boot
  registrarProducto(): void {
    this.error = '';
    this.mensaje = '';

    // Validar los datos
    if (
      !this.nuevoProducto.nombre.trim() ||
      !this.nuevoProducto.categoria.trim() ||
      !Number.isFinite(this.nuevoProducto.precio) ||
      this.nuevoProducto.precio <= 0
    ) {
      this.error = 'Ingresa nombre, categoría y un precio válido.';
      return;
    }

    this.guardando = true;

    this.http.post<Producto>(
      this.apiUrl,
      this.nuevoProducto
    ).subscribe({
      next: () => {
        this.guardando = false;

        this.mensaje = 'Producto registrado correctamente.';

        // Limpiar el formulario
        this.nuevoProducto = {
          nombre: '',
          descripcion: '',
          categoria: '',
          precio: 0,
          imagenUrl: ''
        };

        // Actualizar el formulario
        this.cdr.detectChanges();

        // Volver a consultar los productos
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al registrar producto:', err);

        this.error = 'No se pudo registrar el producto.';
        this.guardando = false;

        // Actualizar la interfaz
        this.cdr.detectChanges();
      }
    });
  }

  // Contar productos activos
  get productosActivos(): number {
    return this.productos.filter(
      producto => producto.activo
    ).length;
  }

  // Contar productos inactivos
  get productosInactivos(): number {
    return this.productos.filter(
      producto => !producto.activo
    ).length;
  }

}
