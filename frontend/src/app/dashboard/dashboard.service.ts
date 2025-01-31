// src/app/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estatisticas {
  totalContatos: number;
  abertos: number;
  respondidos: number;
  finalizados: number;
  mediaFeedback: number;
}

export interface Atendimento {
  userId: { username: string };
  clienteId: { nome: string };
  inicio: Date;
  fim: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardUrl = 'http://localhost:3000/dashboard';
  private historicoUrl = 'http://localhost:3000/historico-atendimentos';

  constructor(private http: HttpClient) { }

  getEstatisticas(): Observable<Estatisticas> {
    return this.http.get<Estatisticas>(`${this.dashboardUrl}`, this.getHeaders());
  }

  getHistoricoAtendimentos(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.historicoUrl}/`, this.getHeaders());
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
}
