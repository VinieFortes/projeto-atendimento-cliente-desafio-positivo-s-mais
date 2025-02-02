import {Component, HostListener, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgIf} from '@angular/common';
import { Router } from '@angular/router';
import {UserComponent} from './auth/user/user.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatFabButton, MatIcon, NgIf, UserComponent, NgClass],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(public router: Router) {}
  title = 'frontend';
  isMobile = false;

  ngOnInit(): void {
    this.checkIfMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkIfMobile();
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    console.log(this.isMobile);
  }

  backRoute(): void {
    this.router.navigate(['/previous-route']);
  }
}
