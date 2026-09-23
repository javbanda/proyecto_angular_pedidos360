import { Component, inject, OnInit, signal } from '@angular/core';
import { ReporteService } from './reporteservice';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [JsonPipe, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  private reportesService = inject(ReporteService);

  kpis = signal('');
  estadosActivos = signal<any[]>([]);
  leadTime = signal<any>(null);
  ventasPorHora = signal<any[]>([]);

  nuevoReporte = {
    pedidoId: null,
    estado: 'CREADO',
    fechaCreacion: '',
    fechaEntrega: '',
    montoTotal: null
  };

  ngOnInit(): void {

    this.reportesService.obtenerKpis().subscribe({
      next: (datos) => {
        console.log('KPIs:', datos);
        this.kpis.set(datos);
      },
      error: (error) => {
        console.error('Error KPIs:', error);
      }
    });

    this.reportesService.obtenerEstadosActivos().subscribe({
      next: (datos) => {
        console.log('Estados activos:', datos);
        this.estadosActivos.set(datos);
      },
      error: (error) => {
        console.error('Error estados:', error);
      }
    });

    this.reportesService.obtenerLeadTime().subscribe({
      next: (datos) => {
        console.log('Lead time:', datos);
        this.leadTime.set(datos);
      },
      error: (error) => {
        console.error('Error lead time:', error);
      }
    });

    this.reportesService.obtenerVentasPorHora().subscribe({
      next: (datos) => {
        console.log('Ventas por hora:', datos);
        this.ventasPorHora.set(datos);
      },
      error: (error) => {
        console.error('Error ventas por hora:', error);
      }
    });
  }
}