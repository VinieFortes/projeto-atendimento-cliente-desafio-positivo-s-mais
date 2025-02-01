import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserComponent } from './user.component';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'getProfile',
      'logout'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      // Como o componente é standalone, podemos importá-lo diretamente
      imports: [UserComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve chamar getProfile e definir userName e userRole se o usuário estiver logado', () => {
      authServiceSpy.isLoggedIn.and.returnValue(true);
      authServiceSpy.getProfile.and.returnValue(
        of({ username: 'testUser', role: 'admin' })
      );

      fixture.detectChanges(); // dispara o ngOnInit

      expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
      expect(authServiceSpy.getProfile).toHaveBeenCalled();
      expect(component.userName).toBe('testUser');
      expect(component.userRole).toBe('admin');
    });

    it('não deve chamar getProfile se o usuário não estiver logado', () => {
      authServiceSpy.isLoggedIn.and.returnValue(false);

      fixture.detectChanges();

      expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
      expect(authServiceSpy.getProfile).not.toHaveBeenCalled();
      expect(component.userName).toBe('');
      expect(component.userRole).toBe('');
    });

    it('deve logar o erro no console se getProfile falhar', () => {
      const consoleSpy = spyOn(console, 'error');
      authServiceSpy.isLoggedIn.and.returnValue(true);
      authServiceSpy.getProfile.and.returnValue(
        throwError(() => new Error('Erro de teste'))
      );

      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar perfil do usuário', jasmine.any(Error));
    });
  });

  describe('Tela compacta (checkScreenSize)', () => {
    it('deve definir isCompact = true quando a largura da tela for < 1512', () => {
      // simula uma tela menor
      spyOnProperty(window, 'innerWidth').and.returnValue(800);

      fixture.detectChanges(); // chama ngOnInit -> checkScreenSize()

      expect(component.isCompact).toBeTrue();
    });

    it('deve definir isCompact = false quando a largura da tela for >= 1512', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1600);

      fixture.detectChanges();

      expect(component.isCompact).toBeFalse();
    });
  });

  describe('onLogout', () => {
    it('deve abrir um diálogo de confirmação e, se confirmado, chamar logout do AuthService', () => {
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<any>>(['afterClosed']);
      matDialogSpy.open.and.returnValue(dialogRefSpy);

      dialogRefSpy.afterClosed.and.returnValue(of(true));

      component.onLogout();

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(dialogRefSpy.afterClosed).toHaveBeenCalled();

      expect(authServiceSpy.logout).toHaveBeenCalled();
    });

    it('deve abrir um diálogo de confirmação e, se cancelado, não chamar logout', () => {
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<any>>(['afterClosed']);
      matDialogSpy.open.and.returnValue(dialogRefSpy);

      dialogRefSpy.afterClosed.and.returnValue(of(false));

      component.onLogout();

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
      expect(authServiceSpy.logout).not.toHaveBeenCalled();
    });
  });
});
