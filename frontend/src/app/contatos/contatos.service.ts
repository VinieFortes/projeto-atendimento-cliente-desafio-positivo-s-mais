import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, Observable} from 'rxjs';

export interface Contato {
  _id?: string;
  nome: string;
  email: string;
  telefone: string;
  canal: string;
  status: string;
  createdAt: string;
}

export interface PaginatedContatos {
  data: Contato[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContatosService {
  private contatosUrl = 'http://localhost:3000/contatos';

  constructor(private http: HttpClient) { }

  getAllContatos(): Observable<Contato[]> {
    const url = `${this.contatosUrl}?page=1&limit=999999`;
    return this.http.get<PaginatedContatos>(url, this.getHeaders()).pipe(
      map((response: PaginatedContatos) => response.data)
    );
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
