import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';

interface LoginResponse {
  access_token: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.urlBase + '/auth';
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser: Observable<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    this.currentUserSubject = new BehaviorSubject<string | null>(token);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            if (response.role) {
              localStorage.setItem('role', response.role);
            }
            this.currentUserSubject.next(response.access_token);
          }
        })
      );
  }

  getProfile(): Observable<{ username: string; role: string }> {
    return this.http.get<{ username: string; role: string }>(`${this.authUrl}/profile`, this.getHeaders());
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
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
