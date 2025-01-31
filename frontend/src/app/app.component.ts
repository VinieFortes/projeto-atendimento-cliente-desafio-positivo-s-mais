import {Component, HostListener, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from '@angular/common';
import { Router } from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {UserComponent} from './auth/user/user.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatFabButton, MatIcon, NgIf, MatMenu, MatMenuItem, MatIconButton, MatMenuTrigger, UserComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent{
  constructor(public router: Router) {}
  title = 'frontend';

  backRoute(): void {
    this.router.navigate(['/previous-route']);
  }
}
