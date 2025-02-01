import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let stateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    // Cria os mocks (spies) para AuthService e Router
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getRole']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Cria mocks mínimos para ActivatedRouteSnapshot e RouterStateSnapshot
    routeSnapshot = new ActivatedRouteSnapshot();
    stateSnapshot = {} as RouterStateSnapshot;
  });

  it('deve permitir acesso (retornar true) se o usuário estiver logado e sem roles no route data', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    // Nenhum roles definido
    routeSnapshot.data = {};

    const canActivate = guard.canActivate(routeSnapshot, stateSnapshot);
    expect(canActivate).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('deve permitir acesso (retornar true) se o usuário estiver logado e tiver a role permitida', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('admin');

    routeSnapshot.data = { roles: ['admin', 'superuser'] };

    const canActivate = guard.canActivate(routeSnapshot, stateSnapshot);
    expect(canActivate).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('deve negar acesso (retornar false) se o usuário estiver logado mas não possuir a role necessária', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('basic');

    routeSnapshot.data = { roles: ['admin', 'superuser'] };

    const canActivate = guard.canActivate(routeSnapshot, stateSnapshot);
    expect(canActivate).toBeFalse();
    // Verifica se redirecionou para '/'
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('deve negar acesso (retornar false) se o usuário não estiver logado e redirecionar para /login', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);

    const canActivate = guard.canActivate(routeSnapshot, stateSnapshot);
    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
