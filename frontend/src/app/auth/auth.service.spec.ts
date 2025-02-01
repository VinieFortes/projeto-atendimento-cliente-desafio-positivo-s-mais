import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    // Verifica se não há requisições pendentes após cada teste
    httpMock.verify();
  });

  describe('login', () => {
    it('deve fazer uma requisição POST e armazenar token/role', () => {
      const mockResponse = { access_token: 'fakeToken', role: 'admin' };

      service.login('john', 'secret').subscribe(response => {
        expect(response.access_token).toBe('fakeToken');
        expect(response.role).toBe('admin');
      });

      // Verifica a requisição HTTP
      const req = httpMock.expectOne(`${environment.urlBase}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'john', password: 'secret' });
      req.flush(mockResponse);

      // Verifica se salvou no localStorage
      expect(localStorage.getItem('token')).toBe('fakeToken');
      expect(localStorage.getItem('role')).toBe('admin');

      // Verifica se o currentUserSubject foi atualizado
      service.currentUser.subscribe(token => {
        expect(token).toBe('fakeToken');
      });
    });
  });

  describe('getProfile', () => {
    it('deve fazer uma requisição GET para /profile com o header de Authorization', () => {
      // Armazena o token antes de chamar getProfile
      localStorage.setItem('token', 'myToken');

      const mockProfile = { username: 'john', role: 'admin' };

      service.getProfile().subscribe(profile => {
        expect(profile.username).toBe('john');
        expect(profile.role).toBe('admin');
      });

      // Verifica a requisição
      const req = httpMock.expectOne(`${environment.urlBase}/auth/profile`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer myToken');

      req.flush(mockProfile);
    });
  });

  describe('logout', () => {
    it('deve remover token/role do localStorage e navegar para /login', () => {
      localStorage.setItem('token', 'fakeToken');
      localStorage.setItem('role', 'admin');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);

      // Verifica se currentUserSubject é nulo
      service.currentUser.subscribe(token => {
        expect(token).toBeNull();
      });
    });
  });

  describe('isLoggedIn', () => {
    it('deve retornar true se houver token no localStorage', () => {
      localStorage.setItem('token', 'fakeToken');
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('deve retornar false se não houver token', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('getToken', () => {
    it('deve retornar o token do localStorage', () => {
      localStorage.setItem('token', 'fakeToken');
      expect(service.getToken()).toBe('fakeToken');
    });

    it('deve retornar null se não houver token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getRole', () => {
    it('deve retornar a role do localStorage', () => {
      localStorage.setItem('role', 'admin');
      expect(service.getRole()).toBe('admin');
    });

    it('deve retornar null se não houver role', () => {
      expect(service.getRole()).toBeNull();
    });
  });
});
