import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface ServerMensagem {
  _id: string;
  atendente: string;
  clienteId: string;
  mensagem: string;
  tipo: string; // 'enviada' or 'recebida'
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Mensagem {
  remetente: string; // 'analista' or 'cliente'
  mensagem: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chatUrl = environment.urlBase;

  constructor(private http: HttpClient) {}

  enviarMensagem(
    clienteId: string,
    mensagem: string,
  ): Observable<{ sentMessage: ServerMensagem; receivedMessage: ServerMensagem }> {
    const payload = { clienteId, mensagem };
    return this.http.post<{ sentMessage: ServerMensagem; receivedMessage: ServerMensagem }>(
      `${this.chatUrl}/chat/send`,
      payload,
      this.getHeaders(),
    );
  }

  receberMensagens(clienteId: string): Observable<ServerMensagem[]> {
    return this.http.get<ServerMensagem[]>(`${this.chatUrl}/chat/messages/${clienteId}`, this.getHeaders());
  }

  encerrarAtendimento(contatoId: string) {
    return this.http.put(`${this.chatUrl}/contatos/${contatoId}/finalizar`, {}, this.getHeaders());

  }

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }
}
