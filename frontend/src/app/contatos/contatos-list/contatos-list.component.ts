// src/app/contatos-list/contatos-list.component.ts
import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { ContatosService, Contato } from '../contatos.service';
import { Router } from '@angular/router';
import {NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contatos-list',
  templateUrl: './contatos-list.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatChipsModule,
    TitleCasePipe,
    NgClass,
    NgIf
  ],
  styleUrl: './contatos-list.component.scss'
})
export class ContatosListComponent implements OnInit {
  contatos: Contato[] = [];
  filteredContatos: Contato[] = [];
  searchTerm: string = '';

  // Paginação
  totalContatos: number = 0;
  contatosPorPagina: number = 5;
  paginaAtual: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isCompact = false;
  isGestor: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Define o modo compacto para larguras de tela menores que 768px
    this.isCompact = window.innerWidth < 1360;
  }

  constructor(private contatosService: ContatosService, private router: Router) { }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isGestor = role === 'gestor';
    this.checkScreenSize();
    this.carregarContatos();
  }

  carregarContatos() {
    this.contatosService.getAllContatos().subscribe({
      next: (allContatos: Contato[]) => {
        // Agora temos todos os contatos
        this.contatos = allContatos;

        // Ordene primeiro pelos "aberto", depois por createdAt (desc):
        this.contatos.sort((a, b) => {
          if (a.status.toLowerCase() === 'aberto' && b.status.toLowerCase() !== 'aberto') {
            return -1;
          } else if (a.status.toLowerCase() !== 'aberto' && b.status.toLowerCase() === 'aberto') {
            return 1;
          } else {
            // Se ambos são "aberto" ou ambos não são "aberto", ordena por data desc
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });

        // Aplique a busca
        this.applySearch();

        // Defina a página inicial do paginator
        this.paginaAtual = 1;
        if (this.paginator) {
          this.paginator.firstPage();
        }

        console.log('Todos os contatos carregados:', this.contatos);
      },
      error: (err) => {
        console.error('Erro ao carregar todos os contatos:', err);
      }
    });
  }

  openDashboard() {
    this.router.navigate(['/dashboard']);
  }

  abrirChat(contato: Contato) {
    if (contato._id) {
      this.router.navigate(['/chat', contato._id], {
        queryParams: {
          nome: contato.nome,
          canal: contato.canal,
          contato_id: contato._id,
          status_atendimento: contato.status
        }
      });
    } else {
      console.error('Contato sem ID');
    }
  }

  applySearch() {
    if (this.searchTerm.trim() === '') {
      // Se não há termo de busca, manter todos os contatos já ordenados
      this.filteredContatos = this.contatos.sort((a, b) => {
        const statusA = a.status.toLowerCase();
        const statusB = b.status.toLowerCase();

        if (statusA === 'aberto' && statusB !== 'aberto') {
          return -1;
        } else if (statusA !== 'aberto' && statusB === 'aberto') {
          return 1;
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
    } else {
      // Filtrar contatos com base no termo de busca
      this.filteredContatos = this.contatos.filter(contato =>
        contato.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contato.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contato.telefone.includes(this.searchTerm)
      ).sort((a, b) => {
        const statusA = a.status.toLowerCase();
        const statusB = b.status.toLowerCase();

        if (statusA === 'aberto' && statusB !== 'aberto') {
          return -1;
        } else if (statusA !== 'aberto' && statusB === 'aberto') {
          return 1;
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
    }

    // Atualizar a contagem total para a paginação baseada nos filtros
    this.totalContatos = this.filteredContatos.length;

    // Resetar para a primeira página após a busca
    this.paginaAtual = 1;
    if (this.paginator) {
      this.paginator.firstPage();
    }

    // Verificar se a página atual excede o número de páginas disponíveis após o filtro
    const totalPaginas = Math.ceil(this.totalContatos / this.contatosPorPagina);
    if (this.paginaAtual > totalPaginas && totalPaginas > 0) {
      this.paginaAtual = totalPaginas;
    }
  }

  paginatedContatos(): Contato[] {
    const startIndex = (this.paginaAtual - 1) * this.contatosPorPagina;
    const endIndex = startIndex + this.contatosPorPagina;
    return this.filteredContatos.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.paginaAtual = event.pageIndex + 1; // O MatPaginator começa em 0
    this.contatosPorPagina = event.pageSize;
    // Nenhuma necessidade de recarregar os contatos, pois estamos manipulando no front-end
  }
}
