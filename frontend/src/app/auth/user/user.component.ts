import {Component, HostListener, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {ConfirmDialogComponent, ConfirmDialogData} from '../../chat/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIconButton,
    NgIf
  ],
  standalone: true
})
export class UserComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  isCompact = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Define o modo compacto para larguras de tela menores que 768px
    this.isCompact = window.innerWidth < 1512;
  }

  constructor(private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    if (this.authService.isLoggedIn()) {
      this.authService.getProfile().subscribe({
        next: (profile: { username: string; role: string; }) => {
          this.userName = profile.username;
          this.userRole = profile.role;
        },
        error: (err: any) => {
          console.error('Erro ao carregar perfil do usuário', err);
        },
      });
    }
  }

  onLogout() {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar Logout',
      message: 'Tem certeza de que deseja sair?',
      confirmText: 'Sim',
      cancelText: 'Não'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
