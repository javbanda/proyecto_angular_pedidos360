import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5001/api/reportes';

  obtenerReportes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}