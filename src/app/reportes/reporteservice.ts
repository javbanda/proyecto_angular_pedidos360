import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);

  private apiUrl = 'https://xw6uf5fra5.execute-api.us-east-1.amazonaws.com';

  obtenerKpis(): Observable<string> {
    return this.http.get(this.apiUrl + '/kpis', {
      responseType: 'text'
    });
  }

  obtenerEstadosActivos(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + '/estados-activos'
    );
  }

  obtenerLeadTime(): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + '/lead-time'
    );
  }

  obtenerVentasPorHora(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + '/ventas-por-hora'
    );
  }
}