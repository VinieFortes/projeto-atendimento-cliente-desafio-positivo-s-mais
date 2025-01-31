import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      const roles = route.data['roles'] as Array<string>;
      if (roles) {
        const userRole = this.authService.getRole();
        console.log(route.data['roles'])
        if (roles.includes(userRole!)) {
          return true;
        } else {
          // Redirecionar ou mostrar mensagem de acesso negado
          this.router.navigate(['/']);
          return false;
        }
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
