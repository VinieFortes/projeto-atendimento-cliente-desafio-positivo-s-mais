import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService, ServerMensagem } from '../chat.service';
import { Subscription } from 'rxjs';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ConfirmDialogComponent, ConfirmDialogData} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon],
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);
  private contatoId: any = null;

  mensagens = signal<Mensagem[]>([]);
  novaMensagem = signal('');
  clienteId = signal('');
  contatoNome = signal('');
  contatoCanal = signal('');
  statusAtendimento = signal('');
  private mensagensSubscription?: Subscription;

  notaCliente = 4;


  @ViewChild('mensagensContainer') private mensagensContainer!: ElementRef;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Subscribe to route parameters
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.clienteId.set(id);
        this.carregarMensagens();
      } else {
        console.error('Cliente ID não fornecido na rota.');
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      this.contatoNome.set(<string>params.get('nome'));
      this.contatoCanal.set(<string>params.get('canal'));
      this.contatoId = params.get('contato_id');
      this.statusAtendimento.set(<string>params.get('status_atendimento'));
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.mensagensSubscription?.unsubscribe();
  }

  carregarMensagens() {
    this.mensagensSubscription = this.chatService.receberMensagens(this.clienteId()).subscribe({
      next: (msgs: ServerMensagem[]) => {
        const formattedMsgs: Mensagem[] = msgs.map((msg) => ({
          remetente: msg.tipo === 'enviada' ? 'analista' : 'cliente',
          mensagem: msg.mensagem,
          timestamp: new Date(msg.createdAt),
        }));
        this.mensagens.set(formattedMsgs);
      },
      error: (error) => {
        console.error('Erro ao carregar mensagens:', error);
      },
    });
  }

  encerrarAtendimento() {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar Encerramento',
      message: 'Tem certeza de que deseja encerrar o atendimento?',
      confirmText: 'Sim',
      cancelText: 'Não'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.chatService.encerrarAtendimento(this.contatoId).subscribe({
          next: (res) => {
            this.statusAtendimento.set('finalizado');
          },
          error: (err) => {
            console.error('Erro ao encerrar atendimento:', err);
          },
        });
      }
    });
  }

  enviarMensagem() {
    const texto = this.novaMensagem().trim();
    if (texto === '') return;

    this.chatService.enviarMensagem(this.clienteId(), texto).subscribe({
      next: (response) => {
        const sentMsg: Mensagem = {
          remetente: 'analista',
          mensagem: response.sentMessage.mensagem,
          timestamp: new Date(response.sentMessage.createdAt),
        };

        const receivedMsg: Mensagem = {
          remetente: 'cliente',
          mensagem: response.receivedMessage.mensagem,
          timestamp: new Date(response.receivedMessage.createdAt),
        };

        this.mensagens.update((msgs) => [...msgs, sentMsg, receivedMsg]);
        this.novaMensagem.set('');
      },
      error: (error) => {
        console.error('Erro ao enviar mensagem:', error);
      },
    });
  }

  trackByTimestamp(index: number, msg: Mensagem): number {
    return msg.timestamp.getTime();
  }

  private scrollToBottom(): void {
    try {
      if (this.mensagensContainer) {
        this.mensagensContainer.nativeElement.scrollTop = this.mensagensContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Erro ao rolar para o fim:', err);
    }
  }
}

interface Mensagem {
  remetente: string; // 'analista' or 'cliente'
  mensagem: string;
  timestamp: Date;
}
