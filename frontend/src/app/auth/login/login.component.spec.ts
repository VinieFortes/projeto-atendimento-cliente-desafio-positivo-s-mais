import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    authSpy.isLoggedIn.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve redirecionar para /contatos se o usuário já estiver logado', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/contatos']);
  });

  it('deve chamar authService.login e navegar para /contatos no sucesso do login', () => {
    component.username = 'john';
    component.password = 'secret';
    authServiceSpy.login.and.returnValue(of({ access_token: 'fakeToken', role: 'user' }));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('john', 'secret');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/contatos']);
  });

  it('deve definir a mensagem de erro se o login falhar', () => {
    component.username = 'john';
    component.password = 'wrong';
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('john', 'wrong');
    expect(component.error).toBe('Usuário ou senha inválidos.');
  });
});
