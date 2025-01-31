import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {
    // Redireciona o usuário para /contatos se já estiver logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/contatos']);
    }
  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/contatos']);
      },
      error: err => {
        this.error = 'Usuário ou senha inválidos.';
      }
    });
  }
}
